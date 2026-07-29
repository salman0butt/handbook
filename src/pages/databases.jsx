import React from 'react';
import HandbookLanding from '../components/HandbookLanding';
import {handbookData} from '../data/handbooks';
export default function DatabasesHandbookLanding() { return <HandbookLanding {...handbookData.databases} />; }
