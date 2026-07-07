# Chatbot Widget

A customizable React chatbot widget component.

## Installation

```bash
npm install chatbot-widget
```

## Usage

```jsx
import React from 'react';
import { ChatBot } from 'chatbot-widget';

function App() {
  return (
    <div>
      <ChatBot token="YOUR_TOKEN" />
    </div>
  );
}

export default App;
```

## Appearance Customization

You can use the following props to adjust the appearance:

| Prop Name | Type   | Description                                              |
|-----------|--------|----------------------------------------------------------|
| `toggleBtncolor`   | string | The color of the chatbot button (default: `#000000`).    |
| `toggleBtnBgColor` | string | The background color of the chatbot button (default: `#ffffff`).|
| `icon`    | string | The icon of the chatbot (default: `fa fa-chatbot`).      |
| `position`| string | The position of the chatbot on the screen (default: `bottom right`). |
| `animate` | boolean | The animation of the chatbot.                            |
| `theme`   | string | The theme of the chatbot (default: `primary`).           |
| `wantToShowSuggestions` | boolean | The suggestions of the chatbot (default: `true`).|

## License

This project is licensed under the MIT License.
