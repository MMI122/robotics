<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all()->keyBy('slug');
        
        $products = [
            [
                'name' => 'Arduino Uno R3',
                'slug' => 'arduino-uno-r3',
                'description' => 'The Arduino Uno R3 High-Quality Edition embodies superior craftsmanship and meticulous attention to detail, resulting in an impeccable build quality. Its components have been carefully selected to ensure robustness and reliability, promoting longevity and sustained functionality even in demanding environments.',
                'short_description' => 'Micro-controller: ATmega328. Operating Voltage: 5V. Digital I/O Pins: 14 (of which 6 provide PWM output). Analog Input Pins: 6.',
                'sku' => 'RBD-0094',
                'price' => 988.00,
                'sale_price' => null,
                'stock_quantity' => 50,
                'featured_image' => 'images/products/arduino-uno-r3.jpg',
                'images' => json_encode(['images/products/arduino-uno-r3.jpg']),
                'category_id' => $categories['development-boards']->id,
                'specifications' => json_encode([
                    'Microcontroller' => 'ATmega328P',
                    'Operating Voltage' => '5V',
                    'Input Voltage (recommended)' => '7-12V',
                    'Digital I/O Pins' => '14 (of which 6 provide PWM output)',
                    'Analog Input Pins' => '6',
                    'Flash Memory' => '32 KB',
                    'SRAM' => '2 KB',
                    'EEPROM' => '1 KB',
                    'Clock Speed' => '16 MHz'
                ]),
                'is_featured' => true,
                'avg_rating' => 4.8,
                'review_count' => 394,
            ],
            [
                'name' => 'Arduino Nano',
                'slug' => 'arduino-nano',
                'description' => 'A small, complete, and breadboard-friendly board based on the ATmega328P. The Arduino Nano has a small form factor which can be used for applications in which the size matters.',
                'short_description' => 'Small form factor Arduino board perfect for compact projects',
                'sku' => 'RBD-0032',
                'price' => 350.00,
                'sale_price' => null,
                'stock_quantity' => 75,
                'featured_image' => 'images/products/arduinonano.jpg',
                'images' => json_encode(['images/products/arduinonano.jpg']),
                'category_id' => $categories['development-boards']->id,
                'specifications' => json_encode([
                    'Microcontroller' => 'ATmega328P',
                    'Operating Voltage' => '5V',
                    'Input Voltage' => '7-12V',
                    'Digital I/O Pins' => '14',
                    'Analog Input Pins' => '8',
                    'Flash Memory' => '32 KB',
                    'SRAM' => '2 KB',
                    'EEPROM' => '1 KB'
                ]),
                'is_featured' => false,
                'avg_rating' => 4.5,
                'review_count' => 123,
            ],
            [
                'name' => 'ESP32 Development Board',
                'slug' => 'esp32-development-board',
                'description' => 'ESP32 is a series of low-cost, low-power system on a chip microcontrollers with integrated Wi-Fi and dual-mode Bluetooth.',
                'short_description' => 'Wi-Fi and Bluetooth enabled microcontroller for IoT projects',
                'sku' => 'RBD-0872',
                'price' => 4600.00,
                'sale_price' => 4000.00,
                'stock_quantity' => 30,
                'featured_image' => 'images/products/esp32-development-board.jpg',
                'images' => json_encode(['images/products/esp32-development-board.jpg']),
                'category_id' => $categories['internet-of-things-iot']->id,
                'specifications' => json_encode([
                    'CPU' => 'Xtensa dual-core 32-bit LX6',
                    'Wi-Fi' => '802.11 b/g/n',
                    'Bluetooth' => 'v4.2 BR/EDR and BLE',
                    'Flash' => '4MB',
                    'SRAM' => '520KB',
                    'GPIO' => '34',
                    'Operating Voltage' => '3.3V'
                ]),
                'is_featured' => true,
                'avg_rating' => 4.7,
                'review_count' => 6,
            ],
            [
                'name' => 'NodeMCU Development Board',
                'slug' => 'nodemcu-development-board',
                'description' => 'NodeMCU is an open source IoT platform. It includes firmware which runs on the ESP8266 Wi-Fi SoC and hardware which is based on the ESP-12 module.',
                'short_description' => 'ESP8266 based development board with Wi-Fi capability',
                'sku' => 'RBD-1001',
                'price' => 850.00,
                'sale_price' => null,
                'stock_quantity' => 40,
                'featured_image' => 'images/products/nodemcuboard.jpg',
                'images' => json_encode(['images/products/nodemcuboard.jpg']),
                'category_id' => $categories['internet-of-things-iot']->id,
                'specifications' => json_encode([
                    'Microcontroller' => 'ESP8266',
                    'Operating Voltage' => '3.3V',
                    'Input Voltage' => '7-12V',
                    'Wi-Fi' => '802.11 b/g/n',
                    'Flash Memory' => '4MB',
                    'Digital I/O' => '11',
                    'Analog Input' => '1'
                ]),
                'is_featured' => false,
                'avg_rating' => 4.4,
                'review_count' => 89,
            ],
            [
                'name' => 'Raspberry Pi 4 Model B',
                'slug' => 'raspberry-pi-4-model-b',
                'description' => 'The Raspberry Pi 4 Model B is the newest Raspberry Pi computer made, and the Pi Foundation knows you can use it for a lot of things.',
                'short_description' => 'Latest Raspberry Pi with improved performance and connectivity',
                'sku' => 'RBD-2440',
                'price' => 21095.00,
                'sale_price' => null,
                'stock_quantity' => 25,
                'featured_image' => 'images/products/raspberry-pi.jpg',
                'images' => json_encode(['images/products/raspberry-pi.jpg']),
                'category_id' => $categories['raspberry-pi']->id,
                'specifications' => json_encode([
                    'Processor' => 'Broadcom BCM2711, Quad core Cortex-A72 (ARM v8) 64-bit SoC @ 1.5GHz',
                    'Memory' => '1GB, 2GB, 4GB or 8GB LPDDR4-3200 SDRAM',
                    'Connectivity' => '2.4 GHz and 5.0 GHz IEEE 802.11ac wireless, Bluetooth 5.0, BLE',
                    'GPIO' => '40-pin GPIO header',
                    'Video' => '2 × micro-HDMI ports (up to 4kp60 supported)',
                    'Storage' => 'Micro-SD card slot for loading operating system and data storage'
                ]),
                'is_featured' => true,
                'avg_rating' => 4.9,
                'review_count' => 22,
            ],
            [
                'name' => '3D Printer Creality Ender 3',
                'slug' => '3d-printer-creality-ender-3',
                'description' => 'The Creality Ender 3 is an excellent choice for beginners and experienced makers alike. Easy to assemble and use.',
                'short_description' => 'Popular 3D printer for beginners and professionals',
                'sku' => 'RBD-3045',
                'price' => 58780.00,
                'sale_price' => null,
                'stock_quantity' => 15,
                'featured_image' => 'images/products/3dprinter.jpg',
                'images' => json_encode(['images/products/3dprinter.jpg']),
                'category_id' => $categories['3d-printer']->id,
                'specifications' => json_encode([
                    'Print Size' => '220 x 220 x 250mm',
                    'Layer Resolution' => '0.1-0.4mm',
                    'Nozzle Temperature' => '≤ 255°C',
                    'Bed Temperature' => '≤ 110°C',
                    'Print Speed' => '180mm/s',
                    'Filament Diameter' => '1.75mm',
                    'File Format' => 'STL, OBJ, AMF'
                ]),
                'is_featured' => true,
                'avg_rating' => 4.6,
                'review_count' => 2,
            ],
            [
                'name' => 'Drone Quadcopter',
                'slug' => 'drone-quadcopter',
                'description' => 'Professional drone with camera for aerial photography and videography. Perfect for hobbyists and professionals.',
                'short_description' => 'Professional drone with HD camera capabilities',
                'sku' => 'RBD-1500',
                'price' => 25000.00,
                'sale_price' => 22000.00,
                'stock_quantity' => 12,
                'featured_image' => 'images/products/drone.jpg',
                'images' => json_encode(['images/products/drone.jpg']),
                'category_id' => $categories['robotics']->id,
                'specifications' => json_encode([
                    'Flight Time' => '25 minutes',
                    'Camera' => '4K HD',
                    'Range' => '2km',
                    'Battery' => '3000mAh LiPo',
                    'Weight' => '570g',
                    'Max Speed' => '50 km/h',
                    'GPS' => 'Yes'
                ]),
                'is_featured' => true,
                'avg_rating' => 4.3,
                'review_count' => 45,
            ],
            [
                'name' => 'Electronic Modules Kit',
                'slug' => 'electronic-modules-kit',
                'description' => 'Complete set of electronic modules for learning and prototyping. Includes sensors, displays, and various components.',
                'short_description' => 'Comprehensive electronic modules kit for learning',
                'sku' => 'RBD-2100',
                'price' => 3500.00,
                'sale_price' => null,
                'stock_quantity' => 35,
                'featured_image' => 'images/products/electronic-modules.jpg',
                'images' => json_encode(['images/products/electronic-modules.jpg']),
                'category_id' => $categories['development-boards']->id,
                'specifications' => json_encode([
                    'Components' => '37 different modules',
                    'Includes' => 'LED, Buzzer, Relay, Sensors, Display',
                    'Compatibility' => 'Arduino, Raspberry Pi',
                    'Documentation' => 'Complete tutorial included',
                    'Skill Level' => 'Beginner to Intermediate'
                ]),
                'is_featured' => false,
                'avg_rating' => 4.2,
                'review_count' => 18,
            ],
            [
                'name' => 'Mechanical Robot Hand',
                'slug' => 'mechanical-robot-hand',
                'description' => 'Programmable robotic hand with servo motors. Perfect for robotics education and research projects.',
                'short_description' => 'Programmable 5-finger robotic hand',
                'sku' => 'RBD-3200',
                'price' => 15000.00,
                'sale_price' => null,
                'stock_quantity' => 8,
                'featured_image' => 'images/products/mechanicalhand.jpg',
                'images' => json_encode(['images/products/mechanicalhand.jpg']),
                'category_id' => $categories['robotics']->id,
                'specifications' => json_encode([
                    'Fingers' => '5 articulated fingers',
                    'Servos' => '5 high-torque servo motors',
                    'Material' => 'ABS Plastic',
                    'Control' => 'Arduino compatible',
                    'Power' => '6V DC',
                    'Weight' => '850g'
                ]),
                'is_featured' => false,
                'avg_rating' => 4.7,
                'review_count' => 12,
            ],
            [
                'name' => 'LED Wall Display Kit',
                'slug' => 'led-wall-display-kit',
                'description' => 'Programmable LED matrix display for creating custom animations and text displays. Great for advertising and decorative purposes.',
                'short_description' => 'Programmable LED matrix display system',
                'sku' => 'RBD-4100',
                'price' => 8500.00,
                'sale_price' => null,
                'stock_quantity' => 20,
                'featured_image' => 'images/products/lEDwall.jpg',
                'images' => json_encode(['images/products/lEDwall.jpg']),
                'category_id' => $categories['sensors']->id,
                'specifications' => json_encode([
                    'Resolution' => '32x32 pixels',
                    'Colors' => 'Full RGB',
                    'Brightness' => 'Adjustable',
                    'Control' => 'Arduino/Raspberry Pi',
                    'Power' => '5V DC',
                    'Size' => '200x200mm'
                ]),
                'is_featured' => false,
                'avg_rating' => 4.1,
                'review_count' => 7,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
