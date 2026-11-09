"""Сиба-ину «Шиба» в гранёном бумажном стиле + мастерская художника (картон, холсты, мольберты, краски).
Запуск: blender -b -P shiba.py -- <out.png> [samples] [eye_open 0..1]
Приметы: рыжая «бумажная» шерсть, белые щёчки/грудь/лапы, треугольные уши, хитрый прищур, закрученный хвост, кисточка за ухом.
"""
import math
import random
import sys

import bmesh
import bpy
from mathutils import Vector

ARGV = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = ARGV[0] if ARGV else r'C:\Users\awright\Desktop\Видео Клод\build\3d\shiba.png'
SAMPLES = int(ARGV[1]) if len(ARGV) > 1 else 48
EYE = float(ARGV[2]) if len(ARGV) > 2 else 0.6
BASE = r'C:\Users\awright\Desktop\Видео Клод'
random.seed(7)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


def hexc(h):
    h = h.lstrip('#')
    return (int(h[0:2], 16) / 255, int(h[2:4], 16) / 255, int(h[4:6], 16) / 255, 1.0)


def lin(c):
    return tuple((x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in c[:3]) + (1.0,)


MATS = {}


def paper(name, color, rough=0.9, emit=None, strength=0.0):
    if name in MATS:
        return MATS[name]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = lin(hexc(color))
    b.inputs['Roughness'].default_value = rough
    if emit:
        b.inputs['Emission Color'].default_value = lin(hexc(emit))
        b.inputs['Emission Strength'].default_value = strength
    # бумажное зерно через bump
    noise = nt.nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 220
    noise.inputs['Detail'].default_value = 6
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = 0.12
    nt.links.new(noise.outputs['Fac'], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    MATS[name] = m
    return m


def flat(o):
    for p in o.data.polygons:
        p.use_smooth = False


def facet(o, jitter=0.0):
    if jitter:
        me = o.data
        for v in me.vertices:
            v.co += Vector((random.uniform(-jitter, jitter), random.uniform(-jitter, jitter), random.uniform(-jitter, jitter)))
    flat(o)


def put(o, m, parent=None, jit=0.0):
    o.data.materials.append(m)
    facet(o, jit)
    if parent:
        o.parent = parent
    return o


def ico(name, loc, size, m, sub=2, rot=(0, 0, 0), parent=None, jit=0.015):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=sub, radius=1, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    o.scale = size
    bpy.context.view_layer.objects.active = o
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return put(o, m, parent, jit)


def box(name, loc, size, m, rot=(0, 0, 0), parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    o.scale = size
    bpy.context.view_layer.objects.active = o
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return put(o, m, parent)


def cone(name, loc, r1, r2, depth, m, rot=(0, 0, 0), verts=4, parent=None, jit=0.0):
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r1, radius2=r2, depth=depth, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    return put(o, m, parent, jit)


def cyl(name, loc, r, depth, m, rot=(0, 0, 0), verts=8, parent=None):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=depth, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    return put(o, m, parent)


# ------------------------------------------------------------- материалы
ORANGE = paper('orange', '#E57A1C')
ORANGE2 = paper('orange2', '#C9600F')
ORANGE3 = paper('orange3', '#F08E34')
WHITE = paper('white', '#F7F2E8')
CREAM = paper('cream', '#E9D9BC')
INK = paper('ink', '#2A1A12', 0.4)
PINK = paper('pink', '#E8A0A0')
BROWN = paper('brown', '#7A4A2A')

DOG = bpy.data.objects.new('Shiba', None)
bpy.context.collection.objects.link(DOG)

# ------------------------------------------------------------- тело
ico('body', (0, 0.08, 0.78), (0.58, 0.6, 0.82), ORANGE, sub=2, parent=DOG)
ico('chest', (0, -0.3, 0.74), (0.4, 0.32, 0.58), WHITE, sub=2, parent=DOG)
ico('bib', (0, -0.42, 0.55), (0.28, 0.2, 0.4), WHITE, sub=1, parent=DOG)
for sx in (-1, 1):
    ico(f'haunch{sx}', (sx * 0.48, 0.22, 0.42), (0.34, 0.52, 0.42), ORANGE2, sub=2, parent=DOG)
    ico(f'foreleg{sx}', (sx * 0.2, -0.36, 0.42), (0.14, 0.16, 0.44), ORANGE, sub=1, parent=DOG)
    ico(f'paw{sx}', (sx * 0.2, -0.45, 0.09), (0.17, 0.26, 0.1), WHITE, sub=1, parent=DOG)
    ico(f'hindpaw{sx}', (sx * 0.5, -0.05, 0.08), (0.17, 0.28, 0.1), WHITE, sub=1, parent=DOG)
# хвост-бублик
tail = bpy.data.objects.new('tailroot', None)
bpy.context.collection.objects.link(tail)
tail.parent = DOG
bpy.ops.mesh.primitive_torus_add(major_radius=0.3, minor_radius=0.13, major_segments=14, minor_segments=5, location=(0.66, 0.5, 0.42), rotation=(math.radians(80), 0, math.radians(25)))
t = bpy.context.object
t.name = 'tail'
put(t, ORANGE3, DOG, 0.01)
ico('tailtip', (0.72, 0.44, 0.7), (0.14, 0.12, 0.13), WHITE, sub=1, parent=DOG)

# ------------------------------------------------------------- голова
HZ = 1.72
ico('head', (0, -0.1, HZ), (0.68, 0.56, 0.52), ORANGE, sub=3, parent=DOG, jit=0.01)
ico('forehead', (0, -0.18, HZ + 0.22), (0.44, 0.3, 0.2), ORANGE3, sub=1, parent=DOG)
for sx in (-1, 1):
    ico(f'cheek{sx}', (sx * 0.4, -0.3, HZ - 0.15), (0.26, 0.28, 0.2), WHITE, sub=2, rot=(0, 0, sx * 0.3), parent=DOG)
    ico(f'cheektuft{sx}', (sx * 0.58, -0.16, HZ - 0.18), (0.1, 0.16, 0.1), WHITE, sub=1, parent=DOG)
ico('muzzle', (0, -0.62, HZ - 0.12), (0.3, 0.3, 0.22), WHITE, sub=2, parent=DOG)
ico('snout', (0, -0.8, HZ - 0.04), (0.17, 0.22, 0.14), WHITE, sub=1, parent=DOG)
ico('nose', (0, -0.99, HZ + 0.01), (0.08, 0.06, 0.06), INK, sub=1, parent=DOG)
ico('mouthL', (-0.1, -0.87, HZ - 0.13), (0.1, 0.04, 0.025), INK, sub=1, rot=(0, 0.3, -0.25), parent=DOG)
ico('mouthR', (0.1, -0.87, HZ - 0.13), (0.1, 0.04, 0.025), INK, sub=1, rot=(0, -0.3, 0.25), parent=DOG)
ico('tongue', (0, -0.84, HZ - 0.2), (0.07, 0.07, 0.04), PINK, sub=1, parent=DOG)

# ------------------------------------------------------------- глаза с веками (прищур регулируется EYE)
EYEOPEN = max(0.0, min(1.0, EYE))
for sx in (-1, 1):
    ex, ey, ez = sx * 0.25, -0.56, HZ + 0.05
    ico(f'eye{sx}', (ex, ey, ez), (0.1, 0.045, 0.12 * (0.3 + 0.7 * EYEOPEN)), INK, sub=1, parent=DOG, jit=0)
    ico(f'glint{sx}', (ex + 0.03, ey - 0.04, ez + 0.03 * EYEOPEN), (0.028, 0.014, 0.028 * (0.3 + 0.7 * EYEOPEN)), WHITE, sub=1, parent=DOG, jit=0)
    # верхнее веко-грань: оранжевая «бумага», опущена на часть глаза
    ico(f'lid{sx}', (ex, ey + 0.012, ez + 0.24 - 0.12 * EYEOPEN), (0.12, 0.05, 0.08), ORANGE, sub=1, rot=(0, sx * 0.25, 0), parent=DOG, jit=0)
    # белая бровь-пятнышко
    ico(f'brow{sx}', (ex, -0.58, HZ + 0.24), (0.09, 0.03, 0.05), WHITE, sub=1, rot=(0, sx * -0.35, 0), parent=DOG, jit=0)
    ico(f'browline{sx}', (ex - sx * 0.12, -0.55, HZ + 0.16), (0.06, 0.02, 0.012), BROWN, sub=1, rot=(0, sx * 0.4, 0), parent=DOG, jit=0)

# ------------------------------------------------------------- уши (4-гранные пирамиды)
for sx in (-1, 1):
    cone(f'ear{sx}', (sx * 0.4, -0.02, HZ + 0.56), 0.22, 0.02, 0.5, ORANGE2, rot=(0.08, sx * 0.2, 0), verts=4, parent=DOG)
    cone(f'earin{sx}', (sx * 0.4, -0.1, HZ + 0.52), 0.15, 0.015, 0.4, WHITE, rot=(0.12, sx * 0.2, 0), verts=4, parent=DOG)
    ico(f'earbase{sx}', (sx * 0.38, -0.02, HZ + 0.34), (0.2, 0.16, 0.12), ORANGE, sub=1, parent=DOG)

# ------------------------------------------------------------- кисточка за левым ухом (справа от зрителя нет: за ухом слева на экране)
BRUSH = bpy.data.objects.new('Brush', None)
bpy.context.collection.objects.link(BRUSH)
BRUSH.parent = DOG
BRUSH.location = (-0.44, 0.1, HZ + 0.42)
BRUSH.rotation_euler = (math.radians(-12), math.radians(-26), 0)
handle = cyl('handle', (0, 0, 0.36), 0.04, 0.72, paper('handle', '#C9954A', 0.5), verts=6, parent=BRUSH)
cyl('ferrule', (0, 0, 0.78), 0.055, 0.16, paper('ferrule', '#C8CCD4', 0.3), verts=6, parent=BRUSH)
cone('bristles', (0, 0, 0.98), 0.07, 0.006, 0.26, paper('paintred', '#D6442A', 0.7), rot=(0, 0, 0), verts=6, parent=BRUSH)
BRUSH.location = (-0.46, 0.12, HZ + 0.1)

DOG.location = (0, 0, 0.03)

# ------------------------------------------------------------- коврик
RUG = [('#C8381F', 2.3, 1.7), ('#F2E3C6', 2.0, 1.4), ('#2F63B8', 1.7, 1.12), ('#F2B53A', 1.4, 0.86), ('#C8381F', 1.1, 0.6)]
for i, (c, w, d) in enumerate(RUG):
    box(f'rug{i}', (0, -0.15, 0.012 + i * 0.006), (w, d, 0.02), paper(f'rug{i}', c), parent=None)
for i in range(18):
    x = -1.05 + i * 0.123
    box(f'fringe{i}', (x, -1.05, 0.014), (0.07, 0.2, 0.012), paper(['fr1', 'fr2', 'fr3'][i % 3], ['#2F63B8', '#F2B53A', '#C8381F'][i % 3]), rot=(0, 0, random.uniform(-0.12, 0.12)))

# ------------------------------------------------------------- мастерская
BOARD = paper('board', '#B7824E', 0.95)
BOARD2 = paper('board2', '#A57445', 0.95)
box('floor', (0, -1.0, -0.02), (10, 8, 0.04), BOARD2)
box('wall', (0, 2.2, 2.6), (10, 0.12, 5.4), BOARD)
box('wallL', (-3.6, 0, 2.6), (0.12, 6, 5.4), BOARD)


def canvas(name, loc, size, rot, layers):
    w, h = size
    box(f'{name}_frame', loc, (w, 0.06, h), paper('canvasframe', '#EFE8D8', 0.8), rot=rot)
    for i, (c, ox, oz, sw, sh) in enumerate(layers):
        px = Vector((ox * w, -0.04 - 0.004 * i, oz * h))
        box(f'{name}_l{i}', loc + Vector((0, 0, 0)) + Vector((ox * w, -0.036 - 0.003 * i, oz * h)), (sw * w, 0.01, sh * h), paper(f'c{c}', c, 0.8), rot=rot)


# холст 1: горы
canvas('c1', Vector((-2.5, 1.2, 1.7)), (1.1, 1.5), (0, 0, 0), [('#9BD3E3', 0, 0, 0.9, 1.3), ('#7E52A8', 0.15, -0.1, 0.5, 0.4), ('#3A5FA0', -0.2, -0.2, 0.55, 0.3), ('#5E9E48', 0, -0.4, 0.9, 0.35), ('#C6D84A', 0, -0.52, 0.9, 0.18)])
# холст 2: закат
canvas('c2', Vector((2.7, 1.7, 2.3)), (1.2, 1.6), (0, 0, 0), [('#C65BA8', 0, 0.2, 0.95, 0.9), ('#F2B53A', 0.1, 0.0, 0.35, 0.4), ('#4D8E4A', 0, -0.25, 0.9, 0.3), ('#2F63B8', 0, -0.42, 0.9, 0.2)])
# холст 3: радуга
canvas('c3', Vector((-1.0, 2.0, 3.6)), (1.3, 1.1), (0, 0, 0), [('#E24B3A', 0, 0.3, 0.9, 0.2), ('#F2A53A', 0, 0.08, 0.9, 0.2), ('#4D8E4A', 0, -0.14, 0.9, 0.2), ('#2F63B8', 0, -0.36, 0.9, 0.2)])
# мольберт
for sx in (-1, 1):
    box(f'easelleg{sx}', (-2.5 + sx * 0.45, 1.3, 0.8), (0.07, 0.07, 1.8), paper('easelwood', '#C9954A', 0.6), rot=(0, sx * 0.14, 0))
box('easelleg3', (-2.5, 1.7, 0.8), (0.07, 0.07, 1.8), paper('easelwood', '#C9954A', 0.6), rot=(-0.2, 0, 0))
box('easelbar', (-2.5, 1.2, 0.5), (1.1, 0.08, 0.1), paper('easelwood', '#C9954A', 0.6))
# прислонённые холсты и ящик
box('leaned1', (1.6, 1.5, 0.9), (1.0, 0.07, 1.6), paper('lean1', '#B9D4DC', 0.8), rot=(-0.12, 0, 0.1))
box('leaned2', (0.2, 1.75, 0.85), (0.9, 0.07, 1.5), paper('lean2', '#D8B07A', 0.9), rot=(-0.12, 0, -0.06))
box('crate', (-1.6, 0.8, 0.28), (0.8, 0.6, 0.56), BOARD, rot=(0, 0, 0.3))
# стаканчик с кистями
cyl('jar', (-3.0, 0.4, 0.3), 0.2, 0.6, paper('jar', '#7BA4D8', 0.5), verts=8)
for i in range(4):
    cyl(f'jb{i}', (-3.0 + 0.05 * (i - 1.5), 0.4, 0.8), 0.018, 0.55, paper('handle', '#C9954A', 0.5), rot=(0.08 * (i - 1.5), 0.1 * (i - 1.5), 0), verts=6)
    cone(f'jt{i}', (-3.0 + 0.05 * (i - 1.5) + 0.03 * (i - 1.5), 0.4, 1.12 + 0.01 * i), 0.03, 0.004, 0.12, paper(f'jc{i}', ['#D6442A', '#2F63B8', '#F2B53A', '#4D8E4A'][i], 0.7), verts=6)
# тюбики с краской на полу
for i, (c, x, y, r) in enumerate([('#F2B53A', -1.2, -1.4, 0.4), ('#2F63B8', 1.5, -1.5, -0.5), ('#4D8E4A', 0.6, -2.0, 0.9), ('#C65BA8', -0.6, -2.1, -0.2)]):
    cyl(f'tube{i}', (x, y, 0.07), 0.07, 0.5, WHITE, rot=(math.pi / 2, 0, r), verts=8)
    cyl(f'tubecap{i}', (x + math.cos(r) * 0.28, y + math.sin(r) * 0.28, 0.07), 0.05, 0.1, paper(f'tc{i}', c, 0.6), rot=(math.pi / 2, 0, r), verts=8)
# палитра
cyl('palette', (2.2, -0.9, 0.03), 0.42, 0.04, paper('pal', '#E2B78A', 0.8), verts=10)
for i, c in enumerate(['#D6442A', '#F2B53A', '#2F63B8', '#4D8E4A', '#C65BA8']):
    ico(f'blob{i}', (2.2 + 0.25 * math.cos(i * 1.2), -0.9 + 0.25 * math.sin(i * 1.2), 0.07), (0.07, 0.07, 0.03), paper(f'bl{i}', c, 0.5), sub=1)

# ------------------------------------------------------------- свет и камера
world = bpy.data.worlds.new('w')
scene.world = world
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = lin(hexc('#E9C9A0'))
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.45
bpy.ops.object.light_add(type='AREA', location=(-3.0, -5.0, 6.0))
key = bpy.context.object
key.data.energy = 800
key.data.size = 5
key.data.color = (1.0, 0.9, 0.78)
key.rotation_euler = (math.radians(55), 0, math.radians(-30))
bpy.ops.object.light_add(type='AREA', location=(4.0, -3.0, 3.0))
fill = bpy.context.object
fill.data.energy = 260
fill.data.size = 4
fill.data.color = (0.8, 0.88, 1.0)
fill.rotation_euler = (math.radians(70), 0, math.radians(50))

bpy.ops.object.camera_add(location=(0.0, -6.3, 2.7))
cam = bpy.context.object
cam.data.lens = 42
cam.rotation_euler = (Vector((0.0, 0.0, 1.5)) - cam.location).to_track_quat('-Z', 'Y').to_euler()
scene.camera = cam

scene.render.engine = 'CYCLES'
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
scene.render.resolution_x = 720
scene.render.resolution_y = 1280
scene.render.filepath = OUT
scene.render.image_settings.file_format = 'PNG'
try:
    scene.view_settings.view_transform = 'Standard'
except Exception:
    scene.view_settings.view_transform = 'Standard'
bpy.ops.wm.save_as_mainfile(filepath=BASE + r'\assets\3d\shiba.blend')
bpy.ops.render.render(write_still=True)
print('RENDERED', OUT)
