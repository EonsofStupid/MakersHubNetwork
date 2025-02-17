import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationProvider } from '../components/NotificationProvider';
import { useNotify } from '@/app/hooks/useNotify';

const TestComponent = () => {
  const { success, error, warning, info, alert, modal, dismiss, dismissAll } = useNotify();

  return (
    <div>
      <button onClick={() => success('Success message')}>Show Success</button>
      <button onClick={() => error('Error message')}>Show Error</button>
      <button onClick={() => warning('Warning message')}>Show Warning</button>
      <button onClick={() => info('Info message')}>Show Info</button>
      <button onClick={() => alert({ description: 'Alert message' })}>Show Alert</button>
      <button onClick={() => modal({ description: 'Modal message' })}>Show Modal</button>
      <button onClick={() => dismissAll()}>Dismiss All</button>
    </div>
  );
};

describe('Notifications', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should show and auto-dismiss success notification', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Show success notification
    await userEvent.click(screen.getByText('Show Success'));

    // Check if notification is shown
    expect(screen.getByText('Success message')).toBeInTheDocument();

    // Fast-forward time to trigger auto-dismiss
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Check if notification is removed
    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });

  it('should show alert that does not auto-dismiss', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Show alert
    await userEvent.click(screen.getByText('Show Alert'));

    // Check if alert is shown
    expect(screen.getByText('Alert message')).toBeInTheDocument();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Check if alert is still shown
    expect(screen.getByText('Alert message')).toBeInTheDocument();
  });

  it('should dismiss all notifications', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Show multiple notifications
    await userEvent.click(screen.getByText('Show Success'));
    await userEvent.click(screen.getByText('Show Error'));
    await userEvent.click(screen.getByText('Show Warning'));

    // Check if all notifications are shown
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();

    // Dismiss all notifications
    await userEvent.click(screen.getByText('Dismiss All'));

    // Check if all notifications are removed
    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
      expect(screen.queryByText('Error message')).not.toBeInTheDocument();
      expect(screen.queryByText('Warning message')).not.toBeInTheDocument();
    });
  });

  it('should show modal in center position', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Show modal
    await userEvent.click(screen.getByText('Show Modal'));

    // Check if modal is shown
    const modalElement = screen.getByText('Modal message');
    expect(modalElement).toBeInTheDocument();
    
    // Check if modal container has center position classes
    const modalContainer = modalElement.closest('.fixed');
    expect(modalContainer).toHaveClass('items-center', 'justify-center');
  });
}); 