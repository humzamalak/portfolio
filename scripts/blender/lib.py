import bpy, math, sys, os
from mathutils import Vector
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")
_m = {}
def reset(bg=(0.01,0.012,0.02), strength=1.0):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    _m.clear()
    s = bpy.context.scene
    s.render.engine = 'CYCLES'
    s.cycles.device = 'CPU'
    s.cycles.samples = 64
    s.cycles.use_denoising = True
    s.cycles.max_bounces = 4
    s.render.resolution_x = 1280; s.render.resolution_y = 720
    s.render.threads_mode = 'FIXED'; s.render.threads = 2
    try: s.view_settings.view_transform = 'AgX'; s.view_settings.look = 'AgX - Medium High Contrast'
    except Exception as e: print("view", e)
    w = bpy.data.worlds.new("W"); s.world = w; w.use_nodes = True
    b = w.node_tree.nodes.get("Background")
    b.inputs[0].default_value = (*bg, 1); b.inputs[1].default_value = strength
    return s
def mat(name, color, rough=0.5, metal=0.0, emit=0.0, ecolor=None, alpha=1.0, trans=0.0):
    if name in _m: return _m[name]
    m = bpy.data.materials.new(name); m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Roughness"].default_value = rough
    p.inputs["Metallic"].default_value = metal
    if emit:
        p.inputs["Emission Color"].default_value = (*(ecolor or color), 1)
        p.inputs["Emission Strength"].default_value = emit
    if trans:
        p.inputs["Transmission Weight"].default_value = trans
    if alpha < 1: p.inputs["Alpha"].default_value = alpha
    _m[name] = m; return m
def _fin(o, m, bevel):
    if m: o.data.materials.append(m)
    if bevel:
        md = o.modifiers.new("b", 'BEVEL'); md.width = bevel; md.segments = 3
        for p in o.data.polygons: p.use_smooth = True
    return o
def box(loc, size, m=None, rot=(0,0,0), bevel=0.02):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.object; o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    return _fin(o, m, bevel)
def cyl(loc, r, h, m=None, rot=(0,0,0), verts=32, bevel=0.0):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, location=loc, rotation=rot, vertices=verts)
    o = bpy.context.object; bpy.ops.object.shade_smooth()
    try: o.modifiers.new("e", 'EDGE_SPLIT')
    except: pass
    return _fin(o, m, bevel)
def sph(loc, r, m=None, seg=32, scale=(1,1,1)):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=seg, ring_count=seg//2)
    o = bpy.context.object; o.scale = scale; bpy.ops.object.shade_smooth()
    return _fin(o, m, 0)
def cone(loc, r1, r2, h, m=None, rot=(0,0,0), verts=32):
    bpy.ops.mesh.primitive_cone_add(radius1=r1, radius2=r2, depth=h, location=loc, rotation=rot, vertices=verts)
    o = bpy.context.object; bpy.ops.object.shade_smooth()
    try: o.modifiers.new("e", 'EDGE_SPLIT')
    except: pass
    return _fin(o, m, 0)
def torus(loc, R, r, m=None, rot=(0,0,0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, location=loc, rotation=rot, major_segments=64, minor_segments=16)
    o = bpy.context.object; bpy.ops.object.shade_smooth(); return _fin(o, m, 0)
def tube(points, r, m=None, cyclic=False):
    cu = bpy.data.curves.new("c", 'CURVE'); cu.dimensions = '3D'
    sp = cu.splines.new('NURBS'); sp.points.add(len(points)-1)
    for p, c in zip(sp.points, points): p.co = (*c, 1)
    sp.use_endpoint_u = True; sp.use_cyclic_u = cyclic; sp.order_u = min(4, len(points))
    cu.bevel_depth = r; cu.bevel_resolution = 6; cu.resolution_u = 24
    o = bpy.data.objects.new("tube", cu); bpy.context.scene.collection.objects.link(o)
    if m: cu.materials.append(m)
    return o
def text(s, loc, size, m=None, rot=(math.pi/2,0,0), extrude=0.02, align='CENTER'):
    bpy.ops.object.text_add(location=loc, rotation=rot)
    o = bpy.context.object; o.data.body = s; o.data.size = size; o.data.extrude = extrude
    o.data.align_x = align
    if m: o.data.materials.append(m)
    return o
def light(kind, loc, energy, color=(1,1,1), size=2.0, rot=(0,0,0), spot=None):
    d = bpy.data.lights.new("L", kind); d.energy = energy; d.color = color
    if kind == 'AREA': d.size = size
    if kind in ('POINT','SPOT'): d.shadow_soft_size = size
    if kind == 'SPOT' and spot: d.spot_size = spot; d.spot_blend = 0.5
    o = bpy.data.objects.new("L", d); o.location = loc; o.rotation_euler = rot
    bpy.context.scene.collection.objects.link(o); return o
def aim(o, target):
    d = Vector(target) - o.location
    o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
def camera(loc, target, lens=50, ortho=None, dof=None):
    d = bpy.data.cameras.new("C"); d.lens = lens
    if ortho: d.type = 'ORTHO'; d.ortho_scale = ortho
    o = bpy.data.objects.new("C", d); o.location = loc
    bpy.context.scene.collection.objects.link(o); aim(o, target)
    if dof:
        d.dof.use_dof = True; d.dof.focus_distance = (Vector(target)-Vector(loc)).length; d.dof.aperture_fstop = dof
    bpy.context.scene.camera = o; return o
def render(name, samples=64, thr=170, gain=3):
    s = bpy.context.scene; s.cycles.samples = samples
    p = os.path.join(OUT, name + "_raw.png"); s.render.filepath = p
    bpy.ops.render.render(write_still=True)
    try:
        from PIL import Image, ImageFilter, ImageChops
        im = Image.open(p).convert("RGB")
        br = im.point(lambda v: max(0, v-thr)*gain)
        g = ImageChops.add(br.filter(ImageFilter.GaussianBlur(8)), br.filter(ImageFilter.GaussianBlur(30)).point(lambda v: v*0.6))
        ImageChops.screen(im, g).save(os.path.join(OUT, name + ".png"))
    except Exception as e:
        print("bloom fail", e); os.replace(p, os.path.join(OUT, name + ".png"))
    try: bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, name + ".glb"), export_apply=True)
    except Exception as e: print("glb fail", e)
