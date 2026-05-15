from PIL import Image

def make_square():
    try:
        img_path = r"c:\Users\Lenovo\Documents\Final_Poject_seb 4\Soft_Eng_Web\Code\skinmate\Frontend\skinmate\src\assets\logo.png"
        out_path = r"c:\Users\Lenovo\Documents\Final_Poject_seb 4\Soft_Eng_Web\Code\skinmate\Frontend\skinmate\src\assets\favicon.png"
        
        img = Image.open(img_path)
        width, height = img.size
        max_dim = max(width, height)
        
        # Create a new square transparent image
        square_img = Image.new('RGBA', (max_dim, max_dim), (0, 0, 0, 0))
        
        # Calculate position to paste the original image
        offset = ((max_dim - width) // 2, (max_dim - height) // 2)
        
        # Paste the original image into the center of the square image
        square_img.paste(img, offset)
        
        # Save the new square image
        square_img.save(out_path, "PNG")
        print("Success")
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    make_square()
