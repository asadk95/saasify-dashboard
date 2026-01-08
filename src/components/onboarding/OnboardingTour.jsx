import { useState, useEffect } from 'react';
import Joyride, { STATUS, ACTIONS, EVENTS } from 'react-joyride';

const tourSteps = [
  {
    target: '.sidebar-logo',
    content: 'Welcome to SaaSify! 👋 Let me give you a quick tour of the dashboard.',
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '.sidebar-nav-list',
    content: 'Navigate through different sections using this sidebar. Access Dashboard, Projects, Team, Analytics, and Billing.',
    placement: 'right',
  },
  {
    target: '.header-search',
    content: 'Use the search bar to quickly find anything across your workspace.',
    placement: 'bottom',
  },
  {
    target: '.header-icon-btn',
    content: 'Toggle between dark and light themes for your preferred viewing experience.',
    placement: 'bottom',
  },
  {
    target: '.header-notifications-btn',
    content: 'Stay updated with notifications about your projects and team activities.',
    placement: 'bottom',
  },
  {
    target: '.header-user-btn',
    content: 'Access your profile settings, preferences, and sign out from here.',
    placement: 'bottom',
  },
];

// Custom styles to match our app theme
const joyrideStyles = {
  options: {
    primaryColor: '#6366f1',
    backgroundColor: '#1a1a2e',
    textColor: '#ffffff',
    overlayColor: 'rgba(0, 0, 0, 0.75)',
    arrowColor: '#1a1a2e',
    zIndex: 10000,
  },
  tooltip: {
    backgroundColor: '#1a1a2e',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  tooltipContainer: {
    textAlign: 'left',
  },
  tooltipTitle: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '8px',
  },
  tooltipContent: {
    fontSize: '14px',
    lineHeight: 1.5,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  buttonNext: {
    backgroundColor: '#6366f1',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    padding: '8px 16px',
  },
  buttonBack: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    marginRight: '8px',
  },
  buttonSkip: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '13px',
  },
  buttonClose: {
    color: 'rgba(255, 255, 255, 0.5)',
    height: '12px',
    width: '12px',
  },
  spotlight: {
    borderRadius: '12px',
  },
};

// Light theme styles
const joyrideStylesLight = {
  options: {
    primaryColor: '#6366f1',
    backgroundColor: '#ffffff',
    textColor: '#0f172a',
    overlayColor: 'rgba(0, 0, 0, 0.5)',
    arrowColor: '#ffffff',
    zIndex: 10000,
  },
  tooltip: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
  },
  tooltipContainer: {
    textAlign: 'left',
  },
  tooltipContent: {
    fontSize: '14px',
    lineHeight: 1.5,
    color: 'rgba(15, 23, 42, 0.8)',
  },
  buttonNext: {
    backgroundColor: '#6366f1',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    padding: '8px 16px',
  },
  buttonBack: {
    color: 'rgba(15, 23, 42, 0.7)',
    fontSize: '14px',
    marginRight: '8px',
  },
  buttonSkip: {
    color: 'rgba(15, 23, 42, 0.5)',
    fontSize: '13px',
  },
  spotlight: {
    borderRadius: '12px',
  },
};

const TOUR_COMPLETED_KEY = 'saasify-tour-completed';

export default function OnboardingTour({ theme = 'dark' }) {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Check if tour was already completed
    const tourCompleted = localStorage.getItem(TOUR_COMPLETED_KEY);

    if (!tourCompleted) {
      // Small delay to ensure all elements are rendered
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoyrideCallback = (data) => {
    const { status, action, index, type } = data;

    // Handle step changes
    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    }

    // Handle tour completion or skip
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    }
  };

  // Function to restart tour (can be called from settings)
  const restartTour = () => {
    setStepIndex(0);
    setRun(true);
  };

  return (
    <Joyride
      steps={tourSteps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showSkipButton
      showProgress
      scrollToFirstStep
      disableScrolling
      callback={handleJoyrideCallback}
      styles={theme === 'dark' ? joyrideStyles : joyrideStylesLight}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
      floaterProps={{
        disableAnimation: false,
      }}
    />
  );
}

// Export function to reset tour (for testing or settings)
export const resetOnboardingTour = () => {
  localStorage.removeItem(TOUR_COMPLETED_KEY);
};
