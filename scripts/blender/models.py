# Game models for "On call": rack.glb and robot.glb. Origin on the floor. Front faces -Y (becomes +Z in three.js).
from lib import *
import random, sys
def export(name):
    for o in bpy.context.scene.objects: o.select_set(o.type=='MESH')
    bpy.context.view_layer.objects.active=[o for o in bpy.context.scene.objects if o.type=='MESH'][0]
    for o in bpy.context.scene.objects:
        if o.type=='MESH':
            bpy.context.view_layer.objects.active=o
            for m in list(o.modifiers): bpy.ops.object.modifier_apply(modifier=m.name)
    bpy.ops.object.join(); bpy.context.object.name=name
    bpy.ops.export_scene.gltf(filepath=sys.argv[-1]+"/"+name+".glb",export_apply=True,export_yup=True)
# ---- rack
random.seed(3); reset()
body=mat("body",(0.035,0.04,0.05),rough=0.4,metal=0.7); face=mat("face",(0.09,0.1,0.125),rough=0.5,metal=0.5)
ok=mat("led_ok",(0,1,0.4),emit=4); warn=mat("led_warn",(1,0.6,0.1),emit=4); strip=mat("strip",(0.2,0.8,1),emit=4); vent=mat("vent",(0.015,0.015,0.02),rough=0.8)
box((0,0,1.1),(0.9,1.0,2.2),body,bevel=0.03)
for k in range(10):
    z=0.25+k*0.19
    box((0,-0.5,z),(0.8,0.04,0.15),face,bevel=0.008)
    box((0.18,-0.523,z),(0.34,0.004,0.09),vent,bevel=0)
    for j in range(5):
        if random.random()>0.2: box((-0.3+j*0.07,-0.53,z),(0.03,0.01,0.03),ok if random.random()>0.25 else warn,bevel=0)
box((0,-0.5,2.1),(0.8,0.02,0.05),strip,bevel=0)
box((0,0,2.215),(0.7,0.8,0.03),vent,bevel=0)
export("rack")
# ---- robot (faces -Y)
reset()
yb=mat("shell",(0.95,0.72,0.08),rough=0.35); dark=mat("dark",(0.03,0.03,0.035),rough=0.6); eye=mat("eye",(0.2,0.8,1),emit=5); beacon=mat("beacon",(1,0.1,0.05),emit=5); grey=mat("grey",(0.3,0.32,0.36),rough=0.4,metal=0.6)
box((0,0,0.42),(0.7,0.9,0.4),yb,bevel=0.08)
box((0,-0.46,0.36),(0.5,0.04,0.12),dark,bevel=0.01)
for sx in (-0.4,0.4):
    for sy in (-0.3,0.3):
        cyl((sx,sy,0.2),0.2,0.14,dark,rot=(0,math.pi/2,0)); cyl((sx*1.19,sy,0.2),0.09,0.02,grey,rot=(0,math.pi/2,0))
box((0,0.1,0.78),(0.4,0.4,0.3),yb,bevel=0.08)
box((0,-0.11,0.8),(0.3,0.02,0.12),eye,bevel=0)
cyl((0.15,0.2,1.15),0.012,0.5,dark); sph((0.15,0.2,1.42),0.045,beacon,seg=12)
box((-0.2,-0.5,0.55),(0.06,0.3,0.06),grey,bevel=0.01); box((0.2,-0.5,0.55),(0.06,0.3,0.06),grey,bevel=0.01)
export("robot")
