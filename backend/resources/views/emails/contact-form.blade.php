<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> {{ $contactData['firstName'] }} {{ $contactData['lastName'] }}</p>
<p><strong>Email:</strong> {{ $contactData['email'] }}</p>
<p><strong>Phone:</strong> {{ $contactData['phone'] ?? '-' }}</p>
<p><strong>Company:</strong> {{ $contactData['company'] ?? '-' }}</p>
<p><strong>Subject:</strong> {{ $contactData['subject'] }}</p>
<p><strong>Category:</strong> {{ ucfirst($contactData['category']) }}</p>
<p><strong>Message:</strong></p>
<p>{{ $contactData['message'] }}</p>