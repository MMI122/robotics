<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Mail\ContactFormMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class ContactController extends Controller
{
    /**
     * Handle contact form submission
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'firstName' => 'required|string|max:255',
                'lastName' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'company' => 'nullable|string|max:255',
                'subject' => 'required|string|max:255',
                'category' => 'required|in:general,support,sales,partnership',
                'message' => 'required|string|max:2000',
            ]);

            // Send email to admin
            Mail::to(config('mail.from.address'))
                ->send(new ContactFormMail($validated));

            // Optionally send confirmation email to user
            Mail::to($validated['email'])
                ->send(new ContactFormMail($validated, true));

            return response()->json([
                'status' => 'success',
                'message' => 'Thank you for contacting us! We will get back to you within 24 hours.'
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Contact form error: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send message. Please try again later.',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }
}