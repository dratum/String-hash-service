import React from 'react';
import './globals.css';
import { Metadata } from 'next';
import { Providers } from './providers';

export const metadata:Metadata = {
  title:"Strings//hash",
}

interface Props {
  children: React.ReactNode
}

export default function RootLayout(props:Props) {
    return (
      <html lang="en">
        <body>
          <Providers>
            {props.children}
          </Providers>
        </body>
      </html>
    )
  }