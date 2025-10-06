<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Development Boards',
                'slug' => 'development-boards',
                'description' => 'Arduino, ESP32, and other development boards for electronics projects',
                'image' => 'images/categories/esp32-development-board.jpg',
                'icon' => 'microchip',
                'sort_order' => 1,
            ],
            [
                'name' => 'Raspberry Pi',
                'slug' => 'raspberry-pi',
                'description' => 'Raspberry Pi boards and accessories',
                'image' => 'images/categories/raspberry-pi.jpg',
                'icon' => 'cpu',
                'sort_order' => 2,
            ],
            [
                'name' => '3D Printer',
                'slug' => '3d-printer',
                'description' => '3D printers and printing accessories',
                'image' => 'images/categories/3dprinter.jpg',
                'icon' => 'cube',
                'sort_order' => 3,
            ],
            [
                'name' => 'Internet of Things (IoT)',
                'slug' => 'internet-of-things-iot',
                'description' => 'IoT modules and smart devices',
                'image' => 'images/categories/iot.jpg',
                'icon' => 'wifi',
                'sort_order' => 4,
            ],
            [
                'name' => 'Robotics',
                'slug' => 'robotics',
                'description' => 'Robotic components and kits',
                'image' => 'images/categories/robotics.jpg',
                'icon' => 'robot',
                'sort_order' => 5,
            ],
            [
                'name' => 'Sensors',
                'slug' => 'sensors',
                'description' => 'Various sensors for electronics projects',
                'image' => 'images/categories/tds-sensor.jpg',
                'icon' => 'sensor',
                'sort_order' => 6,
            ],
            [
                'name' => 'Robot Components',
                'slug' => 'robot-components',
                'description' => 'Robot parts and mechanical components',
                'image' => 'images/categories/robot.jpg',
                'icon' => 'gear',
                'sort_order' => 7,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
