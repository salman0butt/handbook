import React from 'react';
import HandbookLanding from '../components/HandbookLanding';
import {handbookData} from '../data/handbooks';

export default function ReactNativeHandbookLanding() {
  return <HandbookLanding {...handbookData.reactNative} />;
}
