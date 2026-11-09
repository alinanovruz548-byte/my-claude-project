"""3D-героиня (низкополигональная игрушка по фото автора) и уютная комната вечером. Blender 4.4, фон: blender -b -P ana_scene.py -- <out.png> [samples]
Карточка примет героини (не менять от кадра к кадру):
  1) длинные прямые чёрно-коричневые волосы и густая чёлка-шторка;
  2) светлые голубые глаза с графичным тёмным макияжем;
  3) крупные серьги: золотая «монета» и серебряное кольцо;
  4) бордовая кожаная куртка с широкими плечами и чёрные широкие брюки.
"""
import math
import os
import sys

import bmesh
import bpy
from mathutils import Vector

ARGV = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = ARGV[0] if ARGV else r'C:\Users\awright\Desktop\Видео Клод\build\3d\preview.png'
SAMPLES = int(ARGV[1]) if len(ARGV) > 1 else 48
BASE = r'C:\Users\awright\Desktop\Видео Клод'

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


def hexc(h, a=1.0):
    h = h.lstrip('#')
    return (int(h[0:2], 16) / 255, int(h[2:4], 16) / 255, int(h[4:6], 16) / 255, a)


def lin(c):  # sRGB -> linear для Principled
    return tuple((x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in c[:3]) + (1.0,)


MATS = {}


def mat(name, color, rough=0.8, metal=0.0, emit=None, strength=0.0):
    if name in MATS:
        return MATS[name]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = lin(hexc(color))
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    if emit:
        b.inputs['Emission Color'].default_value = lin(hexc(emit))
        b.inputs['Emission Strength'].default_value = strength
    MATS[name] = m
    return m


def flat(o):
    for p in o.data.polygons:
        p.use_smooth = False


def put(o, m, parent=None):
    o.data.materials.append(m)
    flat(o)
    if parent:
        o.parent = parent
    return o


def box(name, loc, size, m, rot=(0, 0, 0), parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    o.scale = size
    return put(o, m, parent)


def sph(name, loc, size, m, sub=2, rot=(0, 0, 0), parent=None):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=sub, radius=1, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    o.scale = size
    return put(o, m, parent)


def cyl(name, loc, r, depth, m, rot=(0, 0, 0), verts=16, parent=None):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=depth, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    return put(o, m, parent)


def cone(name, loc, r1, r2, depth, m, rot=(0, 0, 0), verts=12, parent=None):
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r1, radius2=r2, depth=depth, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    return put(o, m, parent)


def torus(name, loc, R, r, m, rot=(0, 0, 0), parent=None):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=20, minor_segments=8, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    return put(o, m, parent)


# ---------------------------------------------------------------- материалы героини
SKIN = mat('skin', '#F0C3A5', 0.7)
BLUSH = mat('blush', '#E58E8A', 0.8)
HAIR = mat('hair', '#2A1A1F', 0.4)
JACKET = mat('jacket', '#5E1626', 0.42)
JACKET2 = mat('jacket2', '#3E0E19', 0.5)
PANTS = mat('pants', '#17161C', 0.9)
SHOES = mat('shoes', '#0E0D10', 0.5)
GOLD = mat('gold', '#E0B04A', 0.3, 0.9)
SILVER = mat('silver', '#D6D8DE', 0.25, 1.0)
IRIS = mat('iris', '#A9CBE6', 0.3, 0.0, '#8FB8DD', 0.6)
PUPIL = mat('pupil', '#0B0B10', 0.3)
WHITE = mat('white', '#F7F4EE', 0.4)
LINER = mat('liner', '#0B0A0E', 0.6)
SHADOW = mat('eyeshadow', '#D9944F', 0.7)
LIPS = mat('lips', '#C86A66', 0.6)

ANA = bpy.data.objects.new('Ana', None)
bpy.context.collection.objects.link(ANA)

Z0 = 0.0
# ---- ноги: широкие чёрные брюки
for sx in (-1, 1):
    box(f'leg{sx}', (sx * 0.34, 0, 0.72), (0.56, 0.5, 1.46), PANTS, parent=ANA)
    box(f'shoe{sx}', (sx * 0.34, -0.18, 0.13), (0.5, 0.78, 0.27), SHOES, parent=ANA)
# ---- куртка: широкие плечи, талия, баска
box('hips', (0, 0, 1.52), (1.25, 0.66, 0.34), JACKET, parent=ANA)
box('waist', (0, 0, 1.82), (0.92, 0.56, 0.36), JACKET2, parent=ANA)
box('chest', (0, 0, 2.2), (1.34, 0.66, 0.62), JACKET, parent=ANA)
for sx in (-1, 1):
    box(f'shoulder{sx}', (sx * 0.78, 0, 2.42), (0.5, 0.62, 0.34), JACKET, rot=(0, sx * 0.25, 0), parent=ANA)
    box(f'lapel{sx}', (sx * 0.24, -0.35, 2.3), (0.22, 0.08, 0.5), JACKET2, rot=(0, 0, sx * 0.32), parent=ANA)
    # рукава и кисти
    box(f'arm{sx}', (sx * 0.98, -0.02, 1.98), (0.36, 0.4, 0.82), JACKET, rot=(0, sx * -0.12, 0), parent=ANA)
    box(f'cuff{sx}', (sx * 1.04, -0.03, 1.55), (0.38, 0.42, 0.18), JACKET2, rot=(0, sx * -0.12, 0), parent=ANA)
    box(f'hand{sx}', (sx * 1.06, -0.04, 1.4), (0.26, 0.2, 0.3), SKIN, rot=(0, sx * -0.12, 0), parent=ANA)
box('zip', (0, -0.38, 2.34), (0.035, 0.03, 0.42), SILVER, parent=ANA)
box('collar', (0, -0.02, 2.62), (0.62, 0.48, 0.2), JACKET2, parent=ANA)
# ---- шея и голова
box('neck', (0, 0, 2.66), (0.26, 0.26, 0.26), SKIN, parent=ANA)
head = sph('head', (0, 0, 3.12), (0.62, 0.56, 0.66), SKIN, sub=2, parent=ANA)
sph('nose', (0, -0.55, 3.07), (0.07, 0.1, 0.09), SKIN, sub=1, parent=ANA)
box('mouth', (0, -0.53, 2.85), (0.2, 0.05, 0.045), LIPS, parent=ANA)
for sx in (-1, 1):
    sph(f'blush{sx}', (sx * 0.34, -0.5, 2.92), (0.13, 0.03, 0.08), BLUSH, sub=1, parent=ANA)
    sph(f'ear{sx}', (sx * 0.6, 0, 3.08), (0.08, 0.09, 0.15), SKIN, sub=1, parent=ANA)
# ---- глаза: светлые голубые, графичный макияж
EYES = []
for sx in (-1, 1):
    ex = sx * 0.24
    sph(f'eyewhite{sx}', (ex, -0.5, 3.16), (0.15, 0.04, 0.1), WHITE, sub=1, parent=ANA)
    iris = cyl(f'iris{sx}', (ex, -0.55, 3.16), 0.085, 0.03, IRIS, rot=(math.radians(90), 0, 0), verts=14, parent=ANA)
    pup = cyl(f'pupil{sx}', (ex, -0.57, 3.16), 0.04, 0.02, PUPIL, rot=(math.radians(90), 0, 0), verts=10, parent=ANA)
    sph(f'glint{sx}', (ex + 0.03, -0.585, 3.19), (0.016, 0.01, 0.016), WHITE, sub=1, parent=ANA)
    EYES += [iris, pup]
    box(f'liner{sx}', (ex, -0.54, 3.26), (0.2, 0.025, 0.035), LINER, rot=(0, sx * 0.12, 0), parent=ANA)
    box(f'wing{sx}', (ex + sx * 0.13, -0.54, 3.26), (0.12, 0.025, 0.028), LINER, rot=(0, sx * -0.5, 0), parent=ANA)
    sph(f'shadow{sx}', (ex, -0.5, 3.3), (0.17, 0.02, 0.05), SHADOW, sub=1, parent=ANA)
# ---- волосы: макушка и затылок, густая чёлка-шторка, длинные пряди
bm = bmesh.new()
bmesh.ops.create_icosphere(bm, subdivisions=2, radius=1.0)
for v in list(bm.verts):
    v.co = Vector((v.co.x * 0.74, v.co.y * 0.68 + 0.06, v.co.z * 0.8))
bmesh.ops.delete(bm, geom=[v for v in bm.verts if (v.co.y < -0.05 and v.co.z < 0.55)], context='VERTS')
mesh = bpy.data.meshes.new('haircap')
bm.to_mesh(mesh)
bm.free()
cap = bpy.data.objects.new('haircap', mesh)
bpy.context.collection.objects.link(cap)
cap.location = (0, 0, 3.17)
put(cap, HAIR, ANA)
box('bangs', (0, -0.51, 3.4), (1.12, 0.14, 0.27), HAIR, parent=ANA)
for sx in (-1, 1):
    box(f'sidehair{sx}', (sx * 0.56, -0.12, 3.0), (0.2, 0.3, 0.9), HAIR, rot=(0, 0, sx * -0.04), parent=ANA)
    box(f'lock{sx}', (sx * 0.7, -0.14, 2.3), (0.3, 0.3, 1.5), HAIR, rot=(0, 0, sx * 0.02), parent=ANA)
    box(f'lockend{sx}', (sx * 0.72, -0.14, 1.45), (0.24, 0.26, 0.45), HAIR, rot=(0, 0, sx * 0.04), parent=ANA)
box('back', (0, 0.36, 2.6), (1.0, 0.36, 1.5), HAIR, parent=ANA)
box('backend', (0, 0.34, 1.7), (0.8, 0.3, 0.4), HAIR, parent=ANA)
# ---- серьги и золотые заколки
cyl('coin', (0.7, -0.1, 2.78), 0.13, 0.035, GOLD, rot=(0, math.radians(90), 0), parent=ANA)
torus('hoop', (-0.7, -0.1, 2.76), 0.17, 0.028, SILVER, rot=(0, math.radians(90), 0), parent=ANA)
for z in (2.95, 2.58, 2.2):
    box(f'clip{z}', (0.7, -0.18, z), (0.06, 0.1, 0.12), GOLD, parent=ANA)

ANA.location = (0.0, -0.2, 0.0)

# ---------------------------------------------------------------- комната
WOOD = bpy.data.materials.new('wood')
WOOD.use_nodes = True
nt = WOOD.node_tree
brick = nt.nodes.new('ShaderNodeTexBrick')
brick.inputs['Color1'].default_value = lin(hexc('#8C5A38'))
brick.inputs['Color2'].default_value = lin(hexc('#7C4C2E'))
brick.inputs['Mortar'].default_value = lin(hexc('#4A2C1A'))
brick.inputs['Scale'].default_value = 3.0
brick.inputs['Mortar Size'].default_value = 0.01
brick.inputs['Brick Width'].default_value = 1.6
brick.inputs['Row Height'].default_value = 0.2
nt.links.new(brick.outputs['Color'], nt.nodes['Principled BSDF'].inputs['Base Color'])
nt.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.65
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0))
floor = bpy.context.object
floor.scale = (16, 12, 1)
floor.data.materials.append(WOOD)
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.object.mode_set(mode='OBJECT')
# UV для кирпичного узла берём из генерируемых координат по умолчанию

WALL = mat('wall', '#D9B9A2', 0.9)
box('wallback', (0, 3.4, 5.0), (16, 0.2, 10), WALL)
box('wallleft', (-5.0, 0, 5.0), (0.2, 12, 10), mat('wallleft', '#C99F8B', 0.9))
box('base', (0, 3.27, 0.12), (16, 0.08, 0.25), mat('basebd', '#F2E6D8', 0.8))
# окно с ночным городом
sky = bpy.data.materials.new('sky')
sky.use_nodes = True
snt = sky.node_tree
for n in list(snt.nodes):
    snt.nodes.remove(n)
tc = snt.nodes.new('ShaderNodeTexCoord')
sep = snt.nodes.new('ShaderNodeSeparateXYZ')
ramp = snt.nodes.new('ShaderNodeValToRGB')
em = snt.nodes.new('ShaderNodeEmission')
out = snt.nodes.new('ShaderNodeOutputMaterial')
snt.links.new(tc.outputs['UV'], sep.inputs['Vector'])
snt.links.new(sep.outputs['Y'], ramp.inputs['Fac'])
ramp.color_ramp.elements[0].position = 0.0
ramp.color_ramp.elements[0].color = lin(hexc('#F59A5B'))
ramp.color_ramp.elements[1].position = 0.7
ramp.color_ramp.elements[1].color = lin(hexc('#2A1E5C'))
snt.links.new(ramp.outputs['Color'], em.inputs['Color'])
em.inputs['Strength'].default_value = 1.1
snt.links.new(em.outputs['Emission'], out.inputs['Surface'])
bpy.ops.mesh.primitive_plane_add(size=1, location=(1.9, 3.28, 3.2), rotation=(math.radians(90), 0, 0))
glass = bpy.context.object
glass.scale = (2.6, 3.4, 1)
glass.data.materials.append(sky)
FR = mat('winframe', '#EFE3D0', 0.7)
for (lx, lz, sx, sz) in [(1.9, 4.95, 3.0, 0.15), (1.9, 1.45, 3.0, 0.15), (0.5, 3.2, 0.15, 3.6), (3.3, 3.2, 0.15, 3.6), (1.9, 3.2, 0.1, 3.4), (1.9, 3.2, 2.6, 0.1)]:
    box('fr', (lx, 3.22, lz), (sx, 0.14, sz), FR)
# силуэты зданий с горящими окнами
BLD = mat('bld', '#1B1840', 0.9)
WIN = mat('lit', '#FFD27A', 0.5, 0.0, '#FFC25A', 4.0)
import random
random.seed(5)
for i in range(9):
    w = random.uniform(0.35, 0.6)
    h = random.uniform(0.7, 2.0)
    x = 0.75 + i * 0.28
    box('b', (x, 3.25, 1.35 + h / 2), (w, 0.03, h), BLD)
    for k in range(int(h / 0.22)):
        if random.random() < 0.55:
            box('w', (x + random.uniform(-0.1, 0.1), 3.22, 1.5 + k * 0.22), (0.07, 0.02, 0.09), WIN)
# шторы
CURT = mat('curtain', '#D88A2B', 0.85)
box('curtL', (0.1, 3.1, 3.25), (0.7, 0.2, 4.2), CURT)
box('curtR', (3.7, 3.1, 3.25), (0.7, 0.2, 4.2), CURT)
box('rod', (1.9, 3.05, 5.4), (4.4, 0.08, 0.08), GOLD)
# картина в золотой раме (Менины)
box('frame', (-2.0, 3.24, 3.5), (2.3, 0.12, 2.9), GOLD)
pic = bpy.data.materials.new('picture')
pic.use_nodes = True
pnt = pic.node_tree
tex = pnt.nodes.new('ShaderNodeTexImage')
tex.image = bpy.data.images.load(BASE + r'\assets\3d\meninas.jpg')
pnt.links.new(tex.outputs['Color'], pnt.nodes['Principled BSDF'].inputs['Base Color'])
pnt.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.6
bpy.ops.mesh.primitive_plane_add(size=1, location=(-2.0, 3.16, 3.5), rotation=(math.radians(90), 0, 0))
canvas = bpy.context.object
canvas.scale = (2.0, 2.45, 1)
canvas.data.materials.append(pic)
# торшер
box('lampbase', (-3.0, 1.7, 0.08), (0.7, 0.7, 0.16), mat('lampmetal', '#2A2A2E', 0.5))
cyl('lamppole', (-3.0, 1.7, 1.5), 0.05, 3.0, mat('lampmetal', '#2A2A2E', 0.5))
SHADE = mat('shade', '#FFE0A8', 0.6, 0.0, '#FFB860', 3.0)
cone('shade', (-3.0, 1.7, 3.15), 0.62, 0.38, 0.7, SHADE, verts=10)
bpy.ops.object.light_add(type='POINT', location=(-2.8, 1.5, 3.1))
lamp = bpy.context.object
lamp.data.energy = 1100
lamp.data.color = (1.0, 0.68, 0.38)
lamp.data.shadow_soft_size = 0.4
# диван и подушки
SOFA = mat('sofa', '#3B7A72', 0.9)
box('seat', (2.9, 1.7, 0.55), (2.6, 1.2, 0.5), SOFA)
box('sback', (2.9, 2.45, 1.2), (2.6, 0.45, 1.1), SOFA)
box('sarmL', (1.75, 1.7, 0.85), (0.35, 1.2, 0.95), SOFA)
box('sarmR', (4.05, 1.7, 0.85), (0.35, 1.2, 0.95), SOFA)
box('cush1', (2.4, 1.75, 1.0), (0.7, 0.2, 0.7), mat('cushion1', '#E2A33A', 0.9), rot=(0.15, 0, 0.2))
box('cush2', (3.5, 1.75, 1.0), (0.7, 0.2, 0.7), mat('cushion2', '#C85A3A', 0.9), rot=(0.15, 0, -0.2))
# фикус
cyl('pot', (3.7, 2.8, 0.35), 0.45, 0.7, mat('pot', '#C8664A', 0.8), verts=10)
cyl('trunk', (3.7, 2.8, 1.2), 0.07, 1.2, mat('trunk', '#5A3A28', 0.9), verts=6)
LEAF = mat('leaf', '#4F8A4B', 0.8)
for (dx, dy, dz, r) in [(0, 0, 2.1, 0.7), (0.4, 0.1, 1.7, 0.5), (-0.4, 0, 1.8, 0.55), (0.1, -0.3, 2.5, 0.45), (-0.2, 0.3, 2.45, 0.5)]:
    sph('leafball', (3.7 + dx, 2.8 + dy, dz), (r, r, r * 0.9), LEAF)
# ковёр
for i, (r, c) in enumerate([(2.6, '#E8D8C0'), (2.1, '#C8664A'), (1.6, '#E8D8C0')]):
    cyl(f'rug{i}', (0, 0, 0.012 + i * 0.006), r, 0.012, mat(f'rug{i}', c, 0.95), verts=40)

# ---------------------------------------------------------------- свет и камера
world = bpy.data.worlds.new('w')
scene.world = world
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = lin(hexc('#2B2552'))
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.55
bpy.ops.object.light_add(type='AREA', location=(-2.5, -6.0, 4.0))
key = bpy.context.object
key.data.energy = 650
key.data.size = 5
key.data.color = (1.0, 0.86, 0.72)
key.rotation_euler = (math.radians(65), 0, math.radians(-20))
bpy.ops.object.light_add(type='AREA', location=(3.4, 2.6, 3.2))
rim = bpy.context.object
rim.data.energy = 380
rim.data.size = 3
rim.data.color = (0.55, 0.6, 1.0)
rim.rotation_euler = (math.radians(100), 0, math.radians(25))

bpy.ops.object.camera_add(location=(0.0, -9.6, 2.6))
cam = bpy.context.object
cam.data.lens = 40
direction = Vector((0.0, 0.0, 2.55)) - cam.location
cam.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()
scene.camera = cam

scene.render.engine = 'CYCLES'
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
scene.render.resolution_x = 720
scene.render.resolution_y = 1280
scene.render.filepath = OUT
scene.render.image_settings.file_format = 'PNG'
scene.view_settings.view_transform = 'Filmic' if 'Filmic' in [t.identifier for t in bpy.types.ColorManagedViewSettings.bl_rna.properties['view_transform'].enum_items] else 'Standard'
bpy.ops.wm.save_as_mainfile(filepath=BASE + r'\assets\3d\ana_scene.blend')
bpy.ops.render.render(write_still=True)
print('RENDERED', OUT)
