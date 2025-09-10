import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatBox from '@/components/ChatBox';

// Mock the useChat hook
const mockHandleSubmit = jest.fn();
const mockHandleInputChange = jest.fn();
const mockSetInput = jest.fn();

jest.mock('ai/react', () => ({
  useChat: () => ({
    messages: [],
    input: '',
    handleInputChange: mockHandleInputChange,
    handleSubmit: mockHandleSubmit,
    isLoading: false,
    setInput: mockSetInput,
    error: null,
  }),
}));

// Mock DOMPurify
jest.mock('dompurify', () => ({
  sanitize: (content: string) => content,
}));

// Mock fetch for overview API
global.fetch = jest.fn();

describe('ChatBox Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders welcome message on initial load', () => {
    render(<ChatBox />);
    
    expect(screen.getByText(/Hi, I'm Humza's AI assistant!/)).toBeInTheDocument();
    expect(screen.getByText(/Ask about his projects or type 'overview' for a tour/)).toBeInTheDocument();
  });

  it('displays sample query buttons', () => {
    render(<ChatBox />);
    
    expect(screen.getByText("What's Humza's best backend project?")).toBeInTheDocument();
    expect(screen.getByText('Show me a React app')).toBeInTheDocument();
    expect(screen.getByText('What skills does Humza have?')).toBeInTheDocument();
  });

  it('has input field and send button', () => {
    render(<ChatBox />);
    
    expect(screen.getByPlaceholderText(/Ask about Humza's projects/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('calls handleSubmit when form is submitted', () => {
    render(<ChatBox />);
    
    const input = screen.getByPlaceholderText(/Ask about Humza's projects/);
    const form = input.closest('form')!;
    
    fireEvent.change(input, { target: { value: 'test message' } });
    fireEvent.submit(form);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('calls setInput when sample query button is clicked', () => {
    render(<ChatBox />);
    
    const sampleButton = screen.getByText("What's Humza's best backend project?");
    fireEvent.click(sampleButton);

    expect(mockSetInput).toHaveBeenCalledWith("What's Humza's best backend project?");
  });
});
