<h2>Reply to Your Support Ticket</h2>
<p>Dear {{ $ticket->user->name ?? 'Customer' }},</p>
<p>Your ticket subject: <strong>{{ $ticket->subject }}</strong></p>
<p><strong>Our Reply:</strong></p>
<p>{{ $reply }}</p>
<p>If you have further questions, feel free to reply to this email.</p>
<p>Best regards,<br>RoboticsShop Support Team</p>