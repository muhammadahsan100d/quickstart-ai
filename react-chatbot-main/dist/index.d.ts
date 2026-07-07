import React, { ReactNode } from 'react';

interface AppProps {
    icon?: ReactNode;
    toggleBtnBgColor?: string;
    toggleBtncolor?: string;
    animate?: boolean;
    token: string;
    theme?: 'primary' | 'secondary' | 'professional' | 'tech' | '' | undefined;
    position?: 'left' | 'right';
    wantToShowSuggestions?: boolean;
}
declare const App: React.FC<AppProps>;

export { App as ChatBot };
