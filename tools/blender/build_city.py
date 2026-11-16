"""METRO CITY asset source. Run with Blender 4.x: blender -b --python tools/blender/build_city.py
Creates a clean stylized-realistic city block and exports assets/metro_city.glb.
All meshes are authored as smooth architectural forms; no cube-only blockout."""
import bpy, math, os
from mathutils import Vector
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
def mat(name,color,metal=0,rough=.65):
 m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF'); bs.inputs['Base Color'].default_value=(*color,1); bs.inputs['Metallic'].default_value=metal; bs.inputs['Roughness'].default_value=rough
 return m
concrete=mat('Warm limestone',(0.55,.52,.45)); glass=mat('Blue architectural glass',(.055,.19,.25),.45,.18); green=mat('Palm foliage',(.08,.28,.17)); bark=mat('Palm trunk',(.25,.14,.07)); road=mat('Asphalt',(.045,.055,.065)); white=mat('Road markings',(.8,.75,.59))
def cube(name,loc,scale,material,bevel=.12):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc); o=bpy.context.object; o.name=name; o.dimensions=scale; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True); o.data.materials.append(material)
 mod=o.modifiers.new('Soft architectural edges','BEVEL'); mod.width=bevel; mod.segments=3
 o.modifiers.new('Weighted corner normals','WEIGHTED_NORMAL'); return o
def building(x,y,w,d,h):
 cube('Building mass',(x,y,h/2),(w,h,d),concrete,.35)
 for floor in range(max(2,int(h/3))):
  for side in [-1,1]:
   cube('Facade glazing',(x+side*w*.27,y-d/2-.035,1.5+floor*3),(w*.22,.07,1.25),glass,.08)
 cube('Roof crown',(x,y,h+.2),(w*.9,d*.9,.35),concrete,.12)
def palm(x,y):
 bpy.ops.mesh.primitive_cone_add(vertices=16,radius1=.28,radius2=.13,depth=4,location=(x,y,2)); bpy.context.object.data.materials.append(bark)
 for i in range(8):
  a=i*math.tau/8; bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=8,radius=1,location=(x+math.cos(a)*1.25,y+math.sin(a)*1.25,4.2))
  o=bpy.context.object; o.name='Palm leaf'; o.scale=(1.5,.32,.18); o.rotation_euler[2]=a; o.data.materials.append(green)
cube('Main asphalt',(0,0,-.12),(18,170,.24),road,.05)
for z in range(-80,85,9): cube('Lane dash',(0,z,.02),(.16,4,.025),white,.01)
for i in range(10): building(-23, -76+i*17, 10,12,12+(i%4)*4); building(23,-76+i*17,12,11,16+(i%3)*5)
for z in range(-75,80,12): palm(12,z); palm(-12,z)
# Simple articulated mannequin source mesh: separate smooth body parts, ready for rigging/animation refinement.
skin=mat('Character skin',(.48,.27,.18)); fabric=mat('Character jacket',(.035,.12,.2)); pants=mat('Character trousers',(.025,.035,.05))
def capsule(name,loc,radius,depth,material):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=16,radius=1,location=loc); o=bpy.context.object; o.name=name; o.scale=(radius,radius,depth/2); o.data.materials.append(material); return o
capsule('Player torso',(0,0,1.45),.38,.9,fabric); capsule('Player head',(0,0,2.25),.25,.48,skin)
for s in [-1,1]:
 capsule('Arm',(s*.48,0,1.45),.13,.82,fabric); capsule('Leg',(s*.2,0,.55),.16,1.05,pants)
os.makedirs('assets',exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.export_scene.gltf(filepath=os.path.abspath('assets/metro_city.glb'),export_format='GLB',use_selection=True)
print('METRO CITY GLB exported')
