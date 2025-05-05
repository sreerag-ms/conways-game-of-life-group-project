from PIL import Image, ImageDraw

# Create a transparent image with a glider pattern
size = 300  # total image size (pixels)
cell = size // 3  # size of each cell in the 3x3 grid

# Initialize transparent image
img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
draw = ImageDraw.Draw(img)

# Coordinates for the classic glider (col, row)
glider_cells = [(1, 0), (2, 1), (0, 2), (1, 2), (2, 2)]

# Draw black squares for each live cell
for col, row in glider_cells:
    x0 = col * cell
    y0 = row * cell
    draw.rectangle([x0, y0, x0 + cell - 1, y0 + cell - 1], fill=(200, 200, 200, 255))

# Save and display
output_path = './gol_white.png'
img.save(output_path)
img
