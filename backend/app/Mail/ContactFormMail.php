<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public $contactData;
    public $isConfirmation;

    /**
     * Create a new message instance.
     */
    public function __construct(array $contactData, bool $isConfirmation = false)
    {
        $this->contactData = $contactData;
        $this->isConfirmation = $isConfirmation;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        if ($this->isConfirmation) {
            return new Envelope(
                subject: 'Thank you for contacting RoboticsShop - We received your message',
                replyTo: [config('mail.from.address')]
            );
        }

        return new Envelope(
            subject: 'New Contact Form Submission - ' . $this->contactData['subject'],
            replyTo: [$this->contactData['email']]
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        if ($this->isConfirmation) {
            return new Content(
                view: 'emails.contact-confirmation',
                with: ['contactData' => $this->contactData]
            );
        }

        return new Content(
            view: 'emails.contact-form',
            with: ['contactData' => $this->contactData]
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}