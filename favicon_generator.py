# Script that was used to generate the favicon.
from PIL import Image, ImageDraw

size = 300
cell = size // 3

img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
draw = ImageDraw.Draw(img)

glider_cells = [(0, 0),(0, 1), (1, 0), (1, 2), (2, 1)]

for col, row in glider_cells:
    x0 = col * cell
    y0 = row * cell
    draw.rectangle([x0, y0, x0 + cell - 1, y0 + cell - 1], fill=(20, 20, 20, 255))

output_path = './public/gol.png'
img.save(output_path)
img
