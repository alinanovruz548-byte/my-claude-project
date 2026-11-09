import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make_collage_assets as m
m.root = r'C:\Users\awright\Desktop\Видео Клод\remotion\public\n9\img'
m.cutout('n9_03_self.jpg', (0.12, 0.0, 0.95, 0.72), 520, 'cut_self.png', lift=0.7, color=True)
m.cutout('n9_05_uffizi_clean.jpg', (0.34, 0.08, 1.0, 0.5), 560, 'cut_judith_face.png', lift=0.6, color=True)
m.cutout('n9_01_naples.jpg', (0.45, 0.0, 1.0, 0.34), 500, 'cut_judith_art.png', lift=0.6, color=True)
print('ok')
