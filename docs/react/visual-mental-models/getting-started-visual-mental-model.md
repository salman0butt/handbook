---
title: Getting Started — Visual Mental Model
description: Visualize the React app toolchain, createRoot bridge, component tree, render pipeline, and Strict Mode development checks before learning APIs in detail.
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramRow,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# Getting Started — visual mental model

Before writing many components, understand how source code becomes a running React application.

<VisualDiagram title="From source code to visible React UI" subtitle="React is the UI library; Vite and the browser provide surrounding tooling and runtime pieces.">
  <LifecycleBar
    items={[
      { label: 'JSX + JavaScript source', tone: 'blue' },
      { label: 'Vite transforms/bundles modules', tone: 'cyan' },
      { label: 'Browser loads the application', tone: 'slate' },
      { label: 'createRoot connects React to a DOM container', tone: 'purple' },
      { label: 'root.render(<App />)', tone: 'orange' },
      { label: 'React renders the component tree', tone: 'green' },
    ]}
  />
</VisualDiagram>

## The root bridge

<VisualDiagram title="Browser DOM container → React root → component tree">
  <DiagramStack align="center">
    <DiagramNode tone="slate" title="Browser DOM node" wide>`<div id="root"></div>`</DiagramNode>
    <DiagramArrow label="createRoot(container)" />
    <DiagramNode tone="blue" title="React root" wide>React can now manage UI inside this container.</DiagramNode>
    <DiagramArrow label="root.render(<App />)" />
    <DiagramNode tone="purple" title="App component tree" wide>Components calculate the interface for their current inputs.</DiagramNode>
    <DiagramArrow label="commit" />
    <DiagramNode tone="green" title="DOM updates" wide>The browser receives only the host changes React decides are necessary.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## React core vs tooling

<VisualDiagram title="Know which layer owns what">
  <DiagramGrid columns={3}>
    <DiagramNode tone="blue" eyebrow="React" title="UI model">components · state · rendering · Hooks · Context</DiagramNode>
    <DiagramNode tone="purple" eyebrow="Vite" title="Development/build tooling">dev server · module transforms · production build</DiagramNode>
    <DiagramNode tone="green" eyebrow="Browser" title="Host environment">DOM · events · layout · paint · browser APIs</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Rendering is not the same as DOM mutation

<VisualDiagram title="The first render pipeline">
  <LifecycleBar
    items={[
      { label: 'Root render requested', tone: 'orange' },
      { label: 'Components calculate UI', tone: 'purple' },
      { label: 'React reconciles structure + identity', tone: 'cyan' },
      { label: 'Necessary host changes commit', tone: 'green' },
      { label: 'Browser paints', tone: 'blue' },
    ]}
  />
</VisualDiagram>

## Strict Mode

<VisualDiagram title="Strict Mode is a development stress test" subtitle="Repeated work helps reveal unsafe render logic and missing cleanup before production.">
  <DiagramStack align="center">
    <DiagramNode tone="green" title="Component appears to work" wide />
    <DiagramArrow label="development checks" />
    <DiagramGrid columns={3}>
      <DiagramNode tone="purple" title="Repeat render logic">Find impure rendering.</DiagramNode>
      <DiagramNode tone="orange" title="Repeat Effect setup/cleanup">Find missing cleanup.</DiagramNode>
      <DiagramNode tone="cyan" title="Check deprecated/unsafe patterns">Surface problems earlier.</DiagramNode>
    </DiagramGrid>
    <DiagramArrow />
    <DiagramNode tone="blue" title="Safer component assumptions" wide>Code should remain correct when work is restarted or repeated.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Where should you begin?

<DecisionTree
  question="What do you need right now?"
  items={[
    { label: 'Understand what React is', value: 'What is React?' },
    { label: 'Create a small client-side learning project', value: 'Set Up React with Vite' },
    { label: 'Understand createRoot and root.render', value: 'Rendering a React Application' },
    { label: 'Understand repeated development checks', value: 'Strict Mode' },
  ]}
/>

## Keep this picture in your head

<VisualDiagram title="React application startup" compact>
  <DiagramRow>
    <DiagramNode tone="slate" title="Tooling">loads code</DiagramNode>
    <DiagramNode tone="blue" title="Root">connects React</DiagramNode>
    <DiagramNode tone="purple" title="Components">calculate UI</DiagramNode>
    <DiagramNode tone="green" title="Browser">shows committed result</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Continue through the detailed Getting Started chapters for installation, project structure, `createRoot`, first rendering, and Strict Mode behavior.
