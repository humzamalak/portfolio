# Home page room: public/room/room.glb. Blender axes: X right, Y to the back wall, Z up.
# In three.js the back wall is at z = -3 and the left wall at x = -4.
# Run: python3 scripts/blender/room.py public/room
from lib import *
import random, sys
random.seed(8); reset()
floor=mat("floor",(0.36,0.22,0.13),rough=0.55); plank=mat("plank",(0.28,0.165,0.095),rough=0.6)
wall=mat("wall",(0.13,0.16,0.24),rough=0.9); wall2=mat("wall2",(0.105,0.13,0.2),rough=0.9); trim=mat("trim",(0.82,0.8,0.74),rough=0.6)
rug=mat("rug",(0.72,0.3,0.16),rough=0.95); rug2=mat("rug2",(0.9,0.82,0.66),rough=0.95)
wood=mat("wood",(0.2,0.115,0.065),rough=0.45); dark=mat("dark",(0.035,0.037,0.045),rough=0.45,metal=0.4); grey=mat("grey",(0.3,0.32,0.36),rough=0.4,metal=0.5)
beige=mat("beige",(0.7,0.66,0.56),rough=0.6); white=mat("white",(0.9,0.89,0.85),rough=0.5)
screen=mat("screen",(0.01,0.05,0.03),emit=1.0,ecolor=(0.02,0.35,0.16)); glyph=mat("glyph",(0.4,1,0.6),emit=3.5)
lampm=mat("lamp",(1,0.62,0.25),emit=6); window=mat("window",(0.02,0.05,0.16),emit=0.9,ecolor=(0.04,0.1,0.35)); city=mat("city",(1,0.8,0.4),emit=4)
leaf=mat("leaf",(0.1,0.4,0.16),rough=0.6); pot=mat("pot",(0.8,0.45,0.3),rough=0.7); red=mat("mug",(0.8,0.12,0.08),rough=0.3)
door=mat("door",(0.5,0.2,0.12),rough=0.5); sign=mat("door_sign",(1,0.25,0.1),emit=4); poster=mat("poster",(0.05,0.06,0.09),rough=0.7); ptext=mat("poster_text",(1,0.42,0.2),emit=2.2)
# shell
box((0,0,-0.05),(8,6,0.1),floor,bevel=0)
for i in range(1,10): box((-4+i*0.8,0,0.001),(0.02,6,0.004),plank,bevel=0)
box((0,3.1,1.6),(8.2,0.2,3.2),wall,bevel=0); box((-4.1,0,1.6),(0.2,6,3.2),wall2,bevel=0)
box((0,2.98,0.06),(8,0.04,0.12),trim,bevel=0); box((-3.98,0,0.06),(0.04,6,0.12),trim,bevel=0)
box((-0.3,-0.3,0.012),(3.6,2.6,0.024),rug,bevel=0); box((-0.3,-0.3,0.016),(3.2,2.2,0.024),rug2,bevel=0); box((-0.3,-0.3,0.02),(2.8,1.8,0.024),rug,bevel=0)
# window with a night city
box((0.9,2.985,1.9),(1.9,0.07,1.4),trim,bevel=0.01); box((0.9,2.95,1.9),(1.7,0.02,1.2),window,bevel=0)
box((0.9,2.94,1.9),(0.05,0.03,1.2),trim,bevel=0); box((0.9,2.94,1.9),(1.7,0.03,0.05),trim,bevel=0); box((0.9,2.9,1.26),(2.0,0.16,0.05),trim,bevel=0.01)
for i in range(46): box((0.12+random.random()*1.56,2.938,1.34+random.random()**1.7*0.75),(0.03,0.004,0.03),city,bevel=0)
# poster
box((-0.75,2.985,2.1),(0.9,0.03,1.15),poster,bevel=0.005)
for i,l in enumerate(["MAKE","THE","INVISIBLE","WORK."]): text(l,(-1.12,2.965,2.48-i*0.24),0.15,ptext if i==2 else white,extrude=0.004,align='LEFT')
# desk
box((-2.2,2.4,0.76),(2.3,1.0,0.06),wood,bevel=0.015)
for x in (-3.25,-1.15):
    for y in (2.0,2.8): box((x,y,0.37),(0.07,0.07,0.74),dark,bevel=0.01)
box((-1.45,2.4,0.48),(0.6,0.9,0.5),wood,bevel=0.015)
for z in (0.36,0.6): box((-1.45,1.94,z),(0.5,0.02,0.18),plank,bevel=0.005); cyl((-1.45,1.92,z),0.02,0.03,grey,rot=(math.pi/2,0,0))
# monitor, keyboard, mouse
box((-2.2,2.62,0.81),(0.4,0.26,0.03),dark,bevel=0.01); box((-2.2,2.66,0.98),(0.08,0.05,0.34),dark,bevel=0.01)
box((-2.2,2.62,1.38),(1.3,0.07,0.76),dark,bevel=0.02); box((-2.2,2.582,1.38),(1.2,0.01,0.66),screen,bevel=0)
for i,w in enumerate([0.5,0.9,0.7,0.3,0.8,0.6,0.42]): box((-2.74+w/2,2.575,1.63-i*0.08),(w,0.004,0.028),glyph,bevel=0)
box((-2.2,2.12,0.805),(0.8,0.26,0.03),dark,bevel=0.008)
for r_ in range(4):
    for k in range(13): box((-2.56+k*0.06,2.03+r_*0.06,0.826),(0.045,0.045,0.016),grey,bevel=0)
box((-1.62,2.12,0.805),(0.09,0.14,0.035),white,bevel=0.02)
# mug, lamp, small plant, books
cyl((-2.95,2.15,0.87),0.06,0.14,red); torus((-3.02,2.15,0.87),0.04,0.011,red,rot=(math.pi/2,0,0))
cyl((-1.3,2.7,0.8),0.12,0.03,dark); tube([(-1.3,2.7,0.8),(-1.32,2.72,1.25),(-1.5,2.55,1.5),(-1.62,2.45,1.45)],0.016,dark)
cone((-1.66,2.42,1.4),0.14,0.05,0.16,dark,rot=(0.5,-0.6,0)); sph((-1.68,2.4,1.37),0.05,lampm)
cyl((-3.15,2.7,0.86),0.09,0.14,white)
for a_ in range(6): sph((-3.15+0.09*math.cos(a_),2.7+0.09*math.sin(a_),1.02+0.04*(a_%3)),0.08,leaf,scale=(1,0.5,1.5))
# chair, pushed to the side
cx,cy=-0.35,2.3
cyl((cx,cy,0.04),0.3,0.04,dark); cyl((cx,cy,0.25),0.035,0.42,grey); box((cx,cy,0.5),(0.55,0.55,0.1),mat("seat",(0.16,0.2,0.3),rough=0.8),rot=(0,0,0.5),bevel=0.04)
box((cx+0.2,cy+0.11,0.95),(0.09,0.5,0.75),mat("seat",(0,0,0)),rot=(0,0,0.5),bevel=0.04)
# bookshelf on the left wall
box((-3.76,1.55,1.05),(0.44,1.7,2.1),wood,bevel=0.015)
bc=[(0.8,0.3,0.15),(0.15,0.35,0.6),(0.85,0.7,0.2),(0.2,0.55,0.4),(0.85,0.85,0.8),(0.5,0.25,0.5)]
for s in range(4):
    z=0.22+s*0.5; box((-3.7,1.55,z+0.13),(0.4,1.56,0.4),poster,bevel=0)
    y=0.86
    while y<2.2:
        w=random.uniform(0.05,0.11); h=random.uniform(0.24,0.36)
        if random.random()>0.15: box((-3.62,y+w/2,z-0.06+h/2),(0.26,w,h),mat("bk%d"%random.randrange(6),bc[random.randrange(6)],rough=0.7),bevel=0.004)
        y+=w+0.012
# door to the server room, on the left wall
box((-3.985,-1.0,1.08),(0.05,1.15,2.2),trim,bevel=0.005); box((-3.965,-1.0,1.05),(0.05,1.0,2.1),door,bevel=0.01)
for z in (0.55,1.5): box((-3.938,-1.0,z),(0.012,0.74,0.7),mat("door2",(0.42,0.16,0.09),rough=0.5),bevel=0.01)
sph((-3.92,-0.6,1.02),0.045,grey,seg=16)
box((-3.96,-1.0,2.38),(0.05,1.1,0.24),poster,bevel=0.01); text("SERVER ROOM",(-3.93,-1.0,2.32),0.115,sign,rot=(math.pi/2,0,math.pi/2),extrude=0.004)
sph((-3.9,-1.0,2.62),0.06,sign,seg=16)
# server rack against the back wall (front faces the room)
rx,ry=2.7,2.45
body=mat("rack",(0.035,0.04,0.05),rough=0.4,metal=0.7); face=mat("face",(0.09,0.1,0.125),rough=0.5,metal=0.5)
ok=mat("led_ok",(0,1,0.4),emit=3); warn=mat("led_warn",(1,0.6,0.1),emit=3); strip=mat("strip",(0.2,0.8,1),emit=3); vent=mat("vent",(0.015,0.015,0.02),rough=0.8)
box((rx,ry,1.1),(0.9,1.0,2.2),body,bevel=0.03)
for k in range(10):
    z=0.25+k*0.19; box((rx,ry-0.5,z),(0.8,0.04,0.15),face,bevel=0.008); box((rx+0.18,ry-0.523,z),(0.34,0.004,0.09),vent,bevel=0)
    for j in range(5):
        if random.random()>0.2: box((rx-0.3+j*0.07,ry-0.53,z),(0.03,0.01,0.03),ok if random.random()>0.25 else warn,bevel=0)
box((rx,ry-0.5,2.1),(0.8,0.02,0.05),strip,bevel=0)
tube([(2.3,2.9,0.05),(1.0,2.88,0.03),(-0.6,2.9,0.03),(-1.2,2.85,0.2),(-1.25,2.8,0.7)],0.018,dark)
tube([(2.35,2.85,0.05),(1.5,2.8,0.03),(1.6,2.9,0.6),(1.7,2.95,1.2)],0.014,mat("cable2",(0.9,0.5,0.1),rough=0.5))
# big plant and a floor lamp on the right
cyl((3.5,1.5,0.22),0.24,0.44,pot)
for a_ in range(9): sph((3.5+0.22*math.cos(a_*0.7),1.5+0.22*math.sin(a_*0.7),0.75+0.13*(a_%4)),0.2,leaf,scale=(1,0.45,1.9))
cyl((3.55,-0.2,0.02),0.2,0.04,dark); cyl((3.55,-0.2,0.85),0.018,1.7,dark); cone((3.55,-0.2,1.72),0.24,0.14,0.3,beige); sph((3.55,-0.2,1.66),0.07,lampm)
# join and export
for o in bpy.context.scene.objects:
    if o.type in ('CURVE','FONT'):
        bpy.context.view_layer.objects.active=o; o.select_set(True); bpy.ops.object.convert(target='MESH'); o.select_set(False)
for o in bpy.context.scene.objects:
    if o.type=='MESH':
        bpy.context.view_layer.objects.active=o
        for m in list(o.modifiers): bpy.ops.object.modifier_apply(modifier=m.name)
for o in bpy.context.scene.objects: o.select_set(o.type=='MESH')
bpy.context.view_layer.objects.active=[o for o in bpy.context.scene.objects if o.type=='MESH'][0]
bpy.ops.object.join(); bpy.context.object.name="room"
bpy.ops.export_scene.gltf(filepath=sys.argv[-1]+"/room.glb",export_apply=True,export_yup=True)
if "--preview" in sys.argv:
    light('AREA',(2,-4,6),900,(0.8,0.85,1),size=6); light('POINT',(-1.7,2.2,1.5),60,(1,0.6,0.3),size=0.1)
    camera((5.5,-7,5.5),(-0.3,0.8,0.8),lens=30); render("room_preview")
