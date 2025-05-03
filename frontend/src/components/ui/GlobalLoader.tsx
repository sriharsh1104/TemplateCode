import React from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectLoading } from '../../redux/slices/loadingSlice';
import Loader from './Loader';

const GlobalLoader: React.FC = () => {
  const { isLoading, loadingMessage } = useAppSelector(selectLoading);

  if (!isLoading) return null;

  return <Loader fullPage size="large" text={loadingMessage} />;
};

export default GlobalLoader; 