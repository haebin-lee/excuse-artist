![Excuse Smith Logo](excuse-artist-logo.gif)

An AI-powered excuse generator that creates both plausible and creative excuses as vibe and between formal email and short message as format, tailored to your needs, complete with matching images and email integration.

## Demo

![Demo](./Excuse%20Artist.gif)

## Architecture

![AWS Architecture](./architecture.png)

## Features

- **Custom Excuse Generation**: Generate unique excuses using OpenAI and Mistral AI, with adjustable settings for creativity and formality
- **Visual Enhancement**: AI-generated images to complement your excuses
- **Style Preferences**: Toggle between creative and plausible excuses, formal emails and short messages
- **Google Integration**:
  - Seamless login with Google authentication
  - Direct excuse delivery through Gmail
- **History Management**: Store and retrieve your previous excuses and generated images
- **User Convenience**:
  - One-click copy functionality for quick excuse sharing
  - Preview feature to review your excuse before sending

## Tech Stack

- **Frontend**: React.js
- **Backend Services**: AWS Suite including:
  - Lambda
  - API Gateway
  - S3
  - DynamoDB
  - Other AWS services (list specific services used)
- **Authentication**: Google OAuth
- **AI Integration**:
  - OpenAI for primary excuse generation
  - Mistral AI for alternative excuse generation
  - Image generation AI

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/excuse-smith.git

# Navigate to the project directory
cd excuse-smith

# Install dependencies
npm install

# Start the development server
npm start
```

## Environment Setup

```env
REACT_APP_API_ENDPOINT=your_api_endpoint
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_OPENAI_API_KEY=your_openai_api_key
REACT_APP_MISTRAL_API_KEY=your_mistral_api_key
# Add other necessary environment variables
```

## Usage

1. Log in using your Google account
2. Choose your excuse preferences:
   - Creativity level (plausible ↔ creative)
   - Format (formal email ↔ short message)
3. Enter your situation
4. Get your AI-generated excuse with matching image
5. Send directly via Gmail or copy to clipboard

## Contributing

We welcome contributions to Excuse Smith! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
