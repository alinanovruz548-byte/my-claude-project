"""Героиня «Ана» v2: милая 3D-игрушка (большая голова, гладкие формы), чёрный кот с голубыми глазами, современная комната в серо-чёрно-красных тонах.
Запуск: blender -b -P ana_scene2.py -- <out.png> [samples] [pose]
Приметы героини (неизменные): 1) длинные чёрные волосы и мягкая густая чёлка; 2) красный кокошник; 3) большие голубые глаза;
4) красная куртка и чёрные штаны; серьги: золотая монета и серебряное кольцо.
"""
import math
import sys

import bmesh
import bpy
from mathutils import Vector

ARGV = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = ARGV[0] if ARGV else r'C:\Users\awright\Desktop\Видео Клод\build\3d\v2.png'
SAMPLES = int(ARGV[1]) if len(ARGV) > 1 else 48
BASE = r'C:\Users\awright\Desktop\Видео Клод'
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


def hexc(h):
    h = h.lstrip('#')
    return (int(h[0:2], 16) / 255, int(h[2:4], 16) / 255, int(h[4:6], 16) / 255, 1.0)


def lin(c):
    return tuple((x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in c[:3]) + (1.0,)


MATS = {}


def mat(name, color, rough=0.7, metal=0.0, emit=None, strength=0.0, sheen=0.0):
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
    if sheen:
        b.inputs['Sheen Weight'].default_value = sheen
    MATS[name] = m
    return m


def smooth(o):
    for p in o.data.polygons:
        p.use_smooth = True


def finish(o, m, parent=None, sub=0):
    o.data.materials.append(m)
    smooth(o)
    if sub:
        md = o.modifiers.new('sub', 'SUBSURF')
        md.levels = sub
        md.render_levels = sub
    if parent:
        o.parent = parent
    return o


def apply_scale(o):
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.select_set(False)


def rbox(name, loc, size, m, bev=0.08, rot=(0, 0, 0), parent=None, seg=4):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    o.scale = size
    apply_scale(o)
    md = o.modifiers.new('bev', 'BEVEL')
    md.width = bev
    md.segments = seg
    md.limit_method = 'ANGLE'
    return finish(o, m, parent)


def ell(name, loc, size, m, rot=(0, 0, 0), parent=None, seg=32, rings=16):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=rings, radius=1, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    o.scale = size
    return finish(o, m, parent)


def cyl(name, loc, r, depth, m, rot=(0, 0, 0), verts=24, parent=None, bev=0.0):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=depth, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    if bev:
        md = o.modifiers.new('bev', 'BEVEL')
        md.width = bev
        md.segments = 3
    return finish(o, m, parent)


def torus(name, loc, R, r, m, rot=(0, 0, 0), parent=None):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=36, minor_segments=10, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    return finish(o, m, parent)


# ---- конус-штрих для волос: конусный «тейпер»
taper_cu = bpy.data.curves.new('taper', 'CURVE')
taper_cu.dimensions = '3D'
tsp = taper_cu.splines.new('POLY')
tsp.points.add(4)
for i, (x, y) in enumerate([(0, 1.0), (1, 1.0), (2, 0.9), (3, 0.6), (4, 0.12)]):
    tsp.points[i].co = (x, y, 0, 1)
taper = bpy.data.objects.new('taper', taper_cu)
bpy.context.collection.objects.link(taper)


def strand(name, pts, radius, m, parent=None):
    cu = bpy.data.curves.new(name, 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = radius
    cu.bevel_resolution = 4
    cu.resolution_u = 14
    cu.taper_object = taper
    sp = cu.splines.new('BEZIER')
    sp.bezier_points.add(len(pts) - 1)
    for i, p in enumerate(pts):
        bp = sp.bezier_points[i]
        bp.co = p
        bp.handle_left_type = bp.handle_right_type = 'AUTO'
    cu.materials.append(m)
    o = bpy.data.objects.new(name, cu)
    bpy.context.collection.objects.link(o)
    if parent:
        o.parent = parent
    return o


# ---------------------------------------------------------------- материалы героини
SKIN = mat('skin', '#F4CBB0', 0.55)
BLUSH = mat('blush', '#F08C8C', 0.7)
HAIR = mat('hair', '#16101A', 0.32, sheen=0.4)
RED = mat('red', '#C4161C', 0.38)
RED2 = mat('red2', '#8F0F15', 0.45)
PANTS = mat('pants', '#141418', 0.85)
BOOT = mat('boot', '#0B0B0E', 0.4)
GOLD = mat('gold', '#E3B24A', 0.28, 0.95)
SILVER = mat('silver', '#D8DADF', 0.22, 1.0)
IRIS = mat('iris', '#1F7DFF', 0.18, 0.0, '#1A68E8', 0.45)
IRIS2 = mat('iris2', '#63B8FF', 0.2, 0.0, '#3FA0FF', 0.5)
PUPIL = mat('pupil', '#06080E', 0.2)
WHITE = mat('white', '#FAF8F4', 0.3)
LASH = mat('lash', '#0A080C', 0.5)
LIPS = mat('lips', '#D2605E', 0.4)
BROW = mat('brow', '#1B1214', 0.7)

ANA = bpy.data.objects.new('Ana', None)
bpy.context.collection.objects.link(ANA)

# ---- тело (маленькое), ноги, ботинки
for sx in (-1, 1):
    rbox(f'leg{sx}', (sx * 0.25, 0.0, 0.52), (0.36, 0.38, 0.9), PANTS, bev=0.12, parent=ANA)
    rbox(f'boot{sx}', (sx * 0.25, -0.1, 0.13), (0.4, 0.62, 0.26), BOOT, bev=0.1, parent=ANA)
rbox('hip', (0, 0, 0.98), (0.84, 0.5, 0.3), PANTS, bev=0.12, parent=ANA)
rbox('jacket', (0, 0, 1.38), (0.98, 0.58, 0.82), RED, bev=0.2, parent=ANA)
rbox('hem', (0, 0, 1.0), (1.04, 0.62, 0.16), RED2, bev=0.07, parent=ANA)
rbox('collar', (0, -0.02, 1.82), (0.56, 0.46, 0.18), RED2, bev=0.07, parent=ANA)
rbox('zip', (0, -0.3, 1.36), (0.03, 0.03, 0.7), SILVER, bev=0.01, seg=2, parent=ANA)
for sx in (-1, 1):
    ell(f'shoulder{sx}', (sx * 0.58, 0, 1.64), (0.26, 0.26, 0.26), RED, parent=ANA)
    rbox(f'arm{sx}', (sx * 0.68, -0.02, 1.26), (0.24, 0.26, 0.66), RED, bev=0.1, rot=(0, sx * -0.12, 0), parent=ANA)
    rbox(f'cuff{sx}', (sx * 0.73, -0.02, 0.96), (0.26, 0.28, 0.1), RED2, bev=0.04, rot=(0, sx * -0.12, 0), parent=ANA)
    ell(f'hand{sx}', (sx * 0.76, -0.03, 0.82), (0.14, 0.13, 0.15), SKIN, parent=ANA)
GOLD2 = GOLD
PEARL = mat('pearl', '#FFF4DA', 0.2, 0.2)
rbox('gold_hem', (0, -0.015, 1.1), (1.06, 0.64, 0.045), GOLD, bev=0.02, seg=2, parent=ANA)
rbox('gold_collar', (0, -0.02, 1.9), (0.58, 0.48, 0.035), GOLD, bev=0.015, seg=2, parent=ANA)
for sx in (-1, 1):
    rbox(f'gold_cuff{sx}', (sx * 0.73, -0.02, 1.02), (0.27, 0.29, 0.035), GOLD, bev=0.015, seg=2, rot=(0, sx * -0.12, 0), parent=ANA)
for i in range(-4, 5):
    ell(f'jp{i}', (i * 0.105, -0.315 - 0.01 * (4 - abs(i)) * 0.2, 1.17), (0.036, 0.03, 0.036), PEARL, parent=ANA, seg=12, rings=8)
# золотой орнамент на груди: кокошник-арка из жемчужин и ромб
for i in range(1, 7):
    a_ = math.pi * i / 7
    ell(f'chestarc{i}', (math.cos(a_) * 0.22, -0.31, 1.46 + math.sin(a_) * 0.2), (0.028, 0.025, 0.028), PEARL, parent=ANA, seg=10, rings=6)
ell('chestjewel', (0, -0.315, 1.66), (0.05, 0.03, 0.05), mat('jewel', '#FFD25A', 0.2, 0.8), parent=ANA, seg=14, rings=8)
cyl('neck', (0, 0, 1.97), 0.16, 0.2, SKIN, parent=ANA)

# ---- голова (большая, мягкая)
HC = Vector((0, 0, 2.78))
ell('head', HC, (0.9, 0.82, 0.86), SKIN, parent=ANA, seg=48, rings=24)
ell('nose', (0, -0.8, 2.66), (0.055, 0.06, 0.05), SKIN, seg=16, rings=8, parent=ANA)
for sx in (-1, 1):
    ell(f'ear{sx}', (sx * 0.84, 0.0, 2.74), (0.09, 0.11, 0.16), SKIN, parent=ANA)
    ell(f'blush{sx}', (sx * 0.46, -0.7, 2.54), (0.16, 0.03, 0.095), BLUSH, rot=(0, 0, sx * 0.4), parent=ANA)

# ---- лицо: большие голубые глаза
for sx in (-1, 1):
    ex, ey, ez = sx * 0.32, -0.69, 2.76
    ell(f'sclera{sx}', (ex, ey, ez), (0.2, 0.08, 0.235), WHITE, parent=ANA, seg=24, rings=12)
    ell(f'pupil{sx}', (ex - sx * 0.01, ey - 0.075, ez - 0.01), (0.11, 0.035, 0.14), PUPIL, parent=ANA, seg=16, rings=8)
    ell(f'glintA{sx}', (ex + 0.05, ey - 0.12, ez + 0.07), (0.032, 0.015, 0.038), WHITE, parent=ANA, seg=10, rings=6)
    ell(f'glintB{sx}', (ex - 0.04, ey - 0.115, ez - 0.07), (0.016, 0.01, 0.02), WHITE, parent=ANA, seg=8, rings=6)
    # верхнее веко-ресницы и «крылышко»
    rbox(f'lash{sx}', (ex, ey - 0.045, ez + 0.21), (0.27, 0.035, 0.045), LASH, bev=0.018, rot=(0, sx * 0.1, 0), parent=ANA, seg=3)
    rbox(f'wing{sx}', (ex + sx * 0.17, ey - 0.03, ez + 0.2), (0.12, 0.03, 0.035), LASH, bev=0.015, rot=(0, sx * -0.55, 0), parent=ANA, seg=3)
    rbox(f'brow{sx}', (ex, ey - 0.0, ez + 0.4), (0.2, 0.04, 0.045), BROW, bev=0.02, rot=(0, sx * -0.12, 0), parent=ANA, seg=3)
# улыбка: дуга-кривая
smc = bpy.data.curves.new('smile', 'CURVE')
smc.dimensions = '3D'
smc.bevel_depth = 0.022
smc.bevel_resolution = 4
spl = smc.splines.new('BEZIER')
spl.bezier_points.add(2)
for i, pt in enumerate([(-0.14, -0.77, 2.5), (0.0, -0.81, 2.4), (0.14, -0.77, 2.5)]):
    spl.bezier_points[i].co = pt
    spl.bezier_points[i].handle_left_type = spl.bezier_points[i].handle_right_type = 'AUTO'
smc.materials.append(LIPS)
smo = bpy.data.objects.new('smile', smc)
bpy.context.collection.objects.link(smo)
smo.parent = ANA

# ---- волосы: единая объёмная масса (шапка с дугой чёлки + затылок + две толстые пряди спереди), один материал
bm = bmesh.new()
bmesh.ops.create_uvsphere(bm, u_segments=72, v_segments=40, radius=1.0)
CZ = 2.84
for v in bm.verts:
    v.co = Vector((v.co.x * 1.0, v.co.y * 0.93 + 0.06, v.co.z * 0.98))
import math as _m
for v in bm.verts:
    if v.co.y < -0.1:
        thr = 3.16 - 0.45 * v.co.x ** 2 - 0.9 * max(0.0, abs(v.co.x) - 0.6) ** 2 - CZ
        # плавно прижимаем нижнюю часть спереди к линии чёлки: кромка без ступенек
        if v.co.z < thr:
            v.co.z = thr
            v.co.y = max(v.co.y, -0.78 + 0.06 * (v.co.x ** 2))
            v.co.y = _m.copysign(abs(v.co.y), v.co.y)
msh = bpy.data.meshes.new('haircap')
bm.to_mesh(msh)
bm.free()
cap = bpy.data.objects.new('haircap', msh)
bpy.context.collection.objects.link(cap)
cap.location = (0, 0, CZ)
md = cap.modifiers.new('sol', 'SOLIDIFY')
md.thickness = 0.06
md.offset = 1
finish(cap, HAIR, ANA, sub=2)
ell('hairmass', (0, 0.58, 1.95), (0.98, 0.48, 1.45), HAIR, parent=ANA, seg=40, rings=20)
for sx in (-1, 1):
    strand(f'frontlock{sx}', [(sx * 0.74, -0.1, 3.18), (sx * 0.94, -0.1, 2.6), (sx * 0.98, -0.04, 1.75), (sx * 0.86, 0.0, 0.85)], 0.34, HAIR, ANA)
    ell(f'templehair{sx}', (sx * 0.78, -0.14, 3.0), (0.26, 0.26, 0.36), HAIR, parent=ANA, seg=24, rings=12)

# ---- красный кокошник (полукруглый гребень с золотым ободом и жемчугом)
def half_disc(name, radius, depth, m, parent):
    bm = bmesh.new()
    vs = [bm.verts.new((radius * math.cos(math.pi * i / 36), 0, radius * math.sin(math.pi * i / 36))) for i in range(37)]
    face = bm.faces.new(vs)
    res = bmesh.ops.extrude_face_region(bm, geom=[face])
    bmesh.ops.translate(bm, vec=(0, depth, 0), verts=[e for e in res['geom'] if isinstance(e, bmesh.types.BMVert)])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    ms = bpy.data.meshes.new(name)
    bm.to_mesh(ms)
    bm.free()
    o = bpy.data.objects.new(name, ms)
    bpy.context.collection.objects.link(o)
    md = o.modifiers.new('bev', 'BEVEL')
    md.width = 0.025
    md.segments = 3
    return finish(o, m, parent)


KOK = Vector((0, -0.46, 3.3))
k1 = half_disc('kokoshnik', 0.8, 0.14, RED, ANA)
k1.location = KOK
k1.rotation_euler = (0.22, 0, 0)
k2 = half_disc('kokoshnik_rim', 0.9, 0.1, GOLD, ANA)
k2.location = KOK + Vector((0, 0.06, -0.02))
k2.rotation_euler = (0.22, 0, 0)
rbox('kok_band', (0, -0.43, 3.3), (1.84, 0.2, 0.1), GOLD, bev=0.04, parent=ANA)
for i in range(1, 8):
    a = math.pi * i / 8
    ell(f'pearl{i}', (math.cos(a) * 0.62, -0.56 - 0.13 * math.sin(a), 3.3 + math.sin(a) * 0.58 * 0.97), (0.05, 0.035, 0.05), mat('pearl', '#FFF4DA', 0.2, 0.2), parent=ANA, seg=12, rings=8)
ell('jewel', (0, -0.62, 3.62), (0.1, 0.05, 0.1), mat('jewel', '#FFD25A', 0.2, 0.8), parent=ANA, seg=16, rings=8)

# ---- серьги и золотые заколки
cyl('coin', (0.9, -0.05, 2.46), 0.13, 0.035, GOLD, rot=(0, math.radians(90), 0), parent=ANA)
torus('hoop', (-0.9, -0.05, 2.46), 0.16, 0.028, SILVER, rot=(0, math.radians(90), 0), parent=ANA)

ANA.location = (0.0, -0.2, 0.0)

# ---------------------------------------------------------------- чёрный кот с голубыми глазами
CAT = mat('cat', '#0D0D10', 0.35, sheen=0.5)
CATN = mat('catnose', '#E58D95', 0.5)
CATE = mat('cateye', '#59B7FF', 0.15, 0.0, '#3FA0FF', 1.6)
cat = bpy.data.objects.new('Cat', None)
bpy.context.collection.objects.link(cat)
ell('catbody', (0, 0, 0.42), (0.46, 0.62, 0.42), CAT, parent=cat)
ell('cathead', (0, -0.42, 0.98), (0.4, 0.36, 0.34), CAT, parent=cat)
for sx in (-1, 1):
    cone = bpy.ops.mesh.primitive_cone_add(vertices=16, radius1=0.15, radius2=0.01, depth=0.3, location=(sx * 0.24, -0.4, 1.3), rotation=(0, sx * 0.25, 0))
    co = bpy.context.object
    co.name = f'catear{sx}'
    finish(co, CAT, cat)
    ell(f'cateye{sx}', (sx * 0.15, -0.74, 1.02), (0.1, 0.045, 0.115), CATE, parent=cat, seg=20, rings=10)
    ell(f'catpupil{sx}', (sx * 0.15, -0.78, 1.02), (0.022, 0.02, 0.085), PUPIL, parent=cat, seg=10, rings=6)
    ell(f'catglint{sx}', (sx * 0.17, -0.79, 1.07), (0.018, 0.012, 0.022), WHITE, parent=cat, seg=8, rings=6)
    ell(f'paw{sx}', (sx * 0.2, -0.52, 0.12), (0.15, 0.2, 0.12), CAT, parent=cat)
    for k in (-1, 0, 1):
        strand(f'whisker{sx}{k}', [(sx * 0.2, -0.76, 0.88 + k * 0.04), (sx * 0.5, -0.8, 0.88 + k * 0.1), (sx * 0.8, -0.78, 0.84 + k * 0.16)], 0.006, mat('whisk', '#EDEDED', 0.5), cat)
ell('catnose', (0, -0.77, 0.9), (0.04, 0.025, 0.03), CATN, parent=cat, seg=10, rings=6)
strand('cattail', [(0.2, 0.55, 0.22), (0.7, 0.8, 0.3), (0.9, 0.5, 0.9), (0.55, 0.3, 1.1)], 0.07, CAT, cat)
cat.location = (-1.2, -1.15, 0.0)
cat.rotation_euler = (0, 0, math.radians(-15))

# ---------------------------------------------------------------- современная комната: серо-чёрно-красные тона
FLOOR = mat('floor', '#3A3B41', 0.42)
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0))
fl = bpy.context.object
fl.scale = (18, 14, 1)
fl.data.materials.append(FLOOR)
WALL = mat('wall', '#4A4C55', 0.8)
rbox('wallback', (0, 3.4, 5.0), (18, 0.2, 10), WALL, bev=0.0, seg=1)
rbox('wallleft', (-5.0, 0, 5.0), (0.2, 14, 10), mat('wallleft', '#3C3E45', 0.85), bev=0.0, seg=1)
rbox('redpanel', (-0.2, 3.28, 3.0), (9.0, 0.06, 0.06), mat('redstrip', '#FF2A2A', 0.3, 0.0, '#FF2020', 6.0), bev=0.0, seg=1)
rbox('redpanel2', (-0.2, 3.28, 0.3), (9.0, 0.06, 0.06), mat('redstrip', '#FF2A2A', 0.3, 0.0, '#FF2020', 6.0), bev=0.0, seg=1)
# окно с ночным городом (красный закат)
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
ramp.color_ramp.elements[0].color = lin(hexc('#FF4A3A'))
ramp.color_ramp.elements[1].position = 0.75
ramp.color_ramp.elements[1].color = lin(hexc('#1A1230'))
snt.links.new(ramp.outputs['Color'], em.inputs['Color'])
em.inputs['Strength'].default_value = 1.0
snt.links.new(em.outputs['Emission'], out.inputs['Surface'])
bpy.ops.mesh.primitive_plane_add(size=1, location=(1.9, 3.28, 3.2), rotation=(math.radians(90), 0, 0))
gl = bpy.context.object
gl.scale = (2.6, 3.4, 1)
gl.data.materials.append(sky)
FRB = mat('winframe', '#0C0C0F', 0.4)
for (lx, lz, sx, sz) in [(1.9, 4.95, 3.0, 0.14), (1.9, 1.45, 3.0, 0.14), (0.5, 3.2, 0.14, 3.6), (3.3, 3.2, 0.14, 3.6), (1.9, 3.2, 0.08, 3.4), (1.9, 3.2, 2.6, 0.08)]:
    rbox('fr', (lx, 3.2, lz), (sx, 0.14, sz), FRB, bev=0.02, seg=2)
import random
random.seed(5)
BLD = mat('bld', '#0F0A1C', 0.9)
WIN = mat('lit', '#FFB070', 0.5, 0.0, '#FF9A50', 4.0)
for i in range(9):
    w = random.uniform(0.35, 0.6)
    h = random.uniform(0.7, 2.0)
    x = 0.75 + i * 0.28
    rbox('b', (x, 3.25, 1.35 + h / 2), (w, 0.03, h), BLD, bev=0.0, seg=1)
    for k in range(int(h / 0.22)):
        if random.random() < 0.55:
            rbox('w', (x + random.uniform(-0.1, 0.1), 3.22, 1.5 + k * 0.22), (0.07, 0.02, 0.09), WIN, bev=0.0, seg=1)
CURT = mat('curtain', '#1B1B20', 0.95)
rbox('curtL', (0.1, 3.1, 3.25), (0.7, 0.2, 4.2), CURT, bev=0.05)
rbox('curtR', (3.7, 3.1, 3.25), (0.7, 0.2, 4.2), CURT, bev=0.05)
rbox('rod', (1.9, 3.05, 5.4), (4.4, 0.08, 0.08), mat('rodm', '#0C0C0F', 0.3, 0.8), bev=0.03)
# картина «Менины» в чёрной раме с тонкой золотой линией
rbox('frame', (-2.0, 3.24, 3.5), (2.3, 0.12, 2.9), mat('blackframe', '#0B0B0D', 0.3, 0.2), bev=0.04)
rbox('frameline', (-2.0, 3.19, 3.5), (2.12, 0.04, 2.72), GOLD, bev=0.02)
pic = bpy.data.materials.new('picture')
pic.use_nodes = True
pnt = pic.node_tree
tex = pnt.nodes.new('ShaderNodeTexImage')
tex.image = bpy.data.images.load(BASE + r'\assets\3d\meninas.jpg')
pnt.links.new(tex.outputs['Color'], pnt.nodes['Principled BSDF'].inputs['Base Color'])
pnt.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.6
bpy.ops.mesh.primitive_plane_add(size=1, location=(-2.0, 3.14, 3.5), rotation=(math.radians(90), 0, 0))
cv = bpy.context.object
cv.scale = (1.95, 2.35, 1)
cv.data.materials.append(pic)
# торшер-дуга
LM = mat('lampmetal', '#101012', 0.3, 0.7)
cyl('lampbase', (-3.2, 1.7, 0.05), 0.4, 0.1, LM)
cyl('lamppole', (-3.2, 1.7, 1.6), 0.04, 3.2, LM, verts=10)
SHADE = mat('shade', '#FFB090', 0.6, 0.0, '#FF6A4A', 3.5)
cone_ = bpy.ops.mesh.primitive_cone_add(vertices=24, radius1=0.5, radius2=0.28, depth=0.6, location=(-3.2, 1.7, 3.3))
shd = bpy.context.object
shd.name = 'shade'
finish(shd, SHADE)
bpy.ops.object.light_add(type='POINT', location=(-3.0, 1.5, 3.2))
lamp = bpy.context.object
lamp.data.energy = 900
lamp.data.color = (1.0, 0.45, 0.32)
lamp.data.shadow_soft_size = 0.4
# диван и красные подушки
SOFA = mat('sofa', '#222428', 0.7)
rbox('seat', (2.9, 1.7, 0.55), (2.6, 1.2, 0.5), SOFA, bev=0.14)
rbox('sback', (2.9, 2.45, 1.2), (2.6, 0.45, 1.1), SOFA, bev=0.14)
rbox('sarmL', (1.75, 1.7, 0.85), (0.35, 1.2, 0.95), SOFA, bev=0.12)
rbox('sarmR', (4.05, 1.7, 0.85), (0.35, 1.2, 0.95), SOFA, bev=0.12)
rbox('cush1', (2.4, 1.75, 1.0), (0.7, 0.22, 0.7), RED, bev=0.1, rot=(0.15, 0, 0.2))
rbox('cush2', (3.5, 1.75, 1.0), (0.7, 0.22, 0.7), mat('grey', '#8A8D94', 0.8), bev=0.1, rot=(0.15, 0, -0.2))
# растение (монстера из эллипсоидов)
cyl('pot', (3.7, 2.8, 0.35), 0.45, 0.7, mat('pot', '#0E0E10', 0.4), verts=24, bev=0.05)
cyl('trunk', (3.7, 2.8, 1.2), 0.07, 1.2, mat('trunk', '#3A2A22', 0.9), verts=8)
LEAF = mat('leaf', '#2E6B4A', 0.6)
for (dx, dy, dz, r) in [(0, 0, 2.1, 0.7), (0.4, 0.1, 1.7, 0.5), (-0.4, 0, 1.8, 0.55), (0.1, -0.3, 2.5, 0.45), (-0.2, 0.3, 2.45, 0.5)]:
    ell('leafball', (3.7 + dx, 2.8 + dy, dz), (r, r * 0.8, r * 0.9), LEAF, seg=20, rings=10)
# ковёр: чёрно-красно-серый
for i, (r, c) in enumerate([(2.7, '#8A8D94'), (2.25, '#C4161C'), (1.75, '#17171A')]):
    cyl(f'rug{i}', (0, 0, 0.012 + i * 0.006), r, 0.012, mat(f'rug{i}', c, 0.95), verts=64)

# ---------------------------------------------------------------- свет и камера
world = bpy.data.worlds.new('w')
scene.world = world
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = lin(hexc('#26202E'))
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.9
bpy.ops.object.light_add(type='AREA', location=(-2.2, -6.0, 4.4))
key = bpy.context.object
key.data.energy = 1000
key.data.size = 5
key.data.color = (1.0, 0.92, 0.84)
key.rotation_euler = (math.radians(65), 0, math.radians(-18))
bpy.ops.object.light_add(type='AREA', location=(3.4, 2.4, 3.2))
rim = bpy.context.object
rim.data.energy = 420
rim.data.size = 3
rim.data.color = (1.0, 0.25, 0.22)
rim.rotation_euler = (math.radians(100), 0, math.radians(25))
bpy.ops.object.light_add(type='AREA', location=(-3.6, -1.0, 3.0))
fill = bpy.context.object
fill.data.energy = 160
fill.data.size = 3
fill.data.color = (0.6, 0.72, 1.0)
fill.rotation_euler = (math.radians(80), 0, math.radians(-60))

bpy.ops.object.camera_add(location=(0.0, -9.6, 2.5))
cam = bpy.context.object
cam.data.lens = 44
cam.rotation_euler = (Vector((0.0, 0.0, 2.3)) - cam.location).to_track_quat('-Z', 'Y').to_euler()
scene.camera = cam

scene.render.engine = 'CYCLES'
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
scene.render.resolution_x = 720
scene.render.resolution_y = 1280
scene.render.filepath = OUT
scene.render.image_settings.file_format = 'PNG'
try:
    scene.view_settings.view_transform = 'AgX'
except Exception:
    scene.view_settings.view_transform = 'Standard'
bpy.ops.wm.save_as_mainfile(filepath=BASE + r'\assets\3d\ana_scene2.blend')
bpy.ops.render.render(write_still=True)
print('RENDERED', OUT)
