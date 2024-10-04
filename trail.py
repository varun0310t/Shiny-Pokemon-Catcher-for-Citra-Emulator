import cv2
import numpy as np
import socket

def detect_pokemon(image_path, lower_color_range, upper_color_range):
    try:
        image = cv2.imread(image_path)
        if image is None:
            return False

        hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv_image, lower_color_range, upper_color_range)
        kernel = np.ones((5, 5), np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        return bool(contours)
    except Exception as e:
        print(f"An error occurred: {e}")
        return False

def main():
    lower_pokemon_hsv = (30, 150, 50)
    upper_pokemon_hsv = (50, 255, 255)

    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(('127.0.0.1', 5000))
    server.listen(1)

    while True:
        conn, addr = server.accept()
        with conn:
            print('Connected by', addr)
            while True:
                data = conn.recv(1024)
                if not data:
                    break
                image_path = data.decode('utf-8').strip()
                result = detect_pokemon(image_path, lower_pokemon_hsv, upper_pokemon_hsv)
                conn.sendall(b'True' if result else b'False')

if __name__ == "__main__":
    main()
