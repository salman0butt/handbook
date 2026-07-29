import React from 'react';
import HandbookLanding from '../components/HandbookLanding';
import {handbookData} from '../data/handbooks';
export default function NextjsHandbookLanding() { return <HandbookLanding {...handbookData.nextjs} />; }
