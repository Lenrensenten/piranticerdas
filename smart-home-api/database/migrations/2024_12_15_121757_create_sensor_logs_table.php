<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSensorLogsTable extends Migration
{
    public function up()
    {
        Schema::create('sensor_logs', function (Blueprint $table) {
            $table->id();
            $table->boolean('tilted');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sensor_logs');
    }
}
