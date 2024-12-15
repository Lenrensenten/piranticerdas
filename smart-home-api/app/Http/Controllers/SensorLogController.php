<?php

namespace App\Http\Controllers;

use App\Models\SensorLog;
use Illuminate\Http\Request;

class SensorLogController extends Controller
{
    public function index()
    {
        $logs = SensorLog::orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $logs
        ]);
    }

    public function store(Request $request)
    {
        $log = SensorLog::create([
            'tilted' => $request->tilted,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $log
        ]);
    }
}
