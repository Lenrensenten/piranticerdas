<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SensorLogController;

Route::post('/sensor', [SensorLogController::class, 'store']);
Route::get('/sensor', [SensorLogController::class, 'index']);

