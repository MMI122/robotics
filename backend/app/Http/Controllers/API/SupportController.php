<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Support;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class SupportController extends Controller
{
    /**
     * Display a listing of user's support tickets.
     */
    public function index()
    {
        $tickets = Support::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $tickets
        ]);
    }

    /**
     * Store a newly created support ticket.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'subject' => 'required|string|max:255',
                'message' => 'required|string',
                'priority' => 'in:low,medium,high'
            ]);

            $ticket = Support::create([
                'user_id' => Auth::id(),
                'subject' => $validated['subject'],
                'message' => $validated['message'],
                'priority' => $validated['priority'] ?? 'medium',
                'status' => 'open'
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Support ticket created successfully',
                'data' => $ticket
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Display the specified support ticket.
     */
    public function show(Support $support)
    {
        // Ensure user can only view their own tickets
        if ($support->user_id !== Auth::id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $support
        ]);
    }

    /**
     * Update the specified support ticket.
     */
    public function update(Request $request, Support $support)
    {
        // Ensure user can only update their own tickets
        if ($support->user_id !== Auth::id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $validated = $request->validate([
                'message' => 'sometimes|required|string'
            ]);

            if (isset($validated['message'])) {
                $support->update(['message' => $validated['message']]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Support ticket updated successfully',
                'data' => $support
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Admin: Display all support tickets.
     */
    public function adminIndex()
    {
        $tickets = Support::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $tickets
        ]);
    }

    /**
     * Admin: Reply to a support ticket.
     */
    public function adminReply(Request $request, Support $support)
    {
        try {
            $validated = $request->validate([
                'admin_reply' => 'required|string'
            ]);

            $support->update([
                'admin_reply' => $validated['admin_reply'],
                'status' => 'replied'
            ]);

            // Send email notification to user
            if ($support->user && $support->user->email) {
                \Mail::to($support->user->email)
                    ->send(new \App\Mail\SupportReplyMail($support, $validated['admin_reply']));
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Reply sent successfully',
                'data' => $support
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Admin: Update ticket status.
     */
    public function updateStatus(Request $request, Support $support)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:open,in_progress,replied,closed'
            ]);

            $support->update(['status' => $validated['status']]);

            return response()->json([
                'status' => 'success',
                'message' => 'Ticket status updated successfully',
                'data' => $support
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }
}