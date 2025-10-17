<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Modify the tier enum to include VIP
            DB::statement("ALTER TABLE users MODIFY COLUMN tier ENUM('bronze', 'silver', 'gold', 'platinum', 'vip') DEFAULT 'bronze'");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Remove VIP from the enum
            DB::statement("ALTER TABLE users MODIFY COLUMN tier ENUM('bronze', 'silver', 'gold', 'platinum') DEFAULT 'bronze'");
        });
    }
};
