import React from 'react'

export function VisualDiagram({ title, subtitle, children, compact = false }) {
  return (
    <figure className={`hb-diagram${compact ? ' hb-diagram--compact' : ''}`}>
      {(title || subtitle) && (
        <figcaption className="hb-diagram__header">
          {title && <strong className="hb-diagram__title">{title}</strong>}
          {subtitle && <span className="hb-diagram__subtitle">{subtitle}</span>}
        </figcaption>
      )}
      <div className="hb-diagram__canvas">{children}</div>
    </figure>
  )
}

export function DiagramStack({ children, align = 'stretch' }) {
  return (
    <div className="hb-diagram__stack" data-align={align}>
      {children}
    </div>
  )
}

export function DiagramRow({ children, wrap = true }) {
  return (
    <div className="hb-diagram__row" data-wrap={wrap ? 'true' : 'false'}>
      {children}
    </div>
  )
}

export function DiagramGrid({ children, columns = 2 }) {
  return (
    <div className="hb-diagram__grid" style={{ '--hb-grid-columns': columns }}>
      {children}
    </div>
  )
}

export function DiagramNode({ title, children, tone = 'blue', eyebrow, wide = false }) {
  return (
    <div className={`hb-diagram__node hb-diagram__node--${tone}${wide ? ' hb-diagram__node--wide' : ''}`}>
      {eyebrow && <span className="hb-diagram__eyebrow">{eyebrow}</span>}
      {title && <strong className="hb-diagram__nodeTitle">{title}</strong>}
      {children && <div className="hb-diagram__nodeBody">{children}</div>}
    </div>
  )
}

export function DiagramArrow({ label, direction = 'down' }) {
  const horizontal = direction === 'right'

  return (
    <div className={`hb-diagram__arrow hb-diagram__arrow--${direction}`} aria-hidden="true">
      {label && <span className="hb-diagram__arrowLabel">{label}</span>}
      <svg
        width={horizontal ? 88 : 28}
        height={horizontal ? 28 : 58}
        viewBox={horizontal ? '0 0 88 28' : '0 0 28 58'}
        role="presentation"
        focusable="false"
      >
        {horizontal ? (
          <>
            <line x1="4" y1="14" x2="72" y2="14" className="hb-diagram__arrowLine" />
            <path d="M66 7 L78 14 L66 21" className="hb-diagram__arrowHead" />
          </>
        ) : (
          <>
            <line x1="14" y1="4" x2="14" y2="44" className="hb-diagram__arrowLine" />
            <path d="M7 38 L14 50 L21 38" className="hb-diagram__arrowHead" />
          </>
        )}
      </svg>
    </div>
  )
}

export function DiagramBranch({ title, children, tone = 'slate' }) {
  return (
    <div className={`hb-diagram__branch hb-diagram__branch--${tone}`}>
      {title && <strong className="hb-diagram__branchTitle">{title}</strong>}
      <div className="hb-diagram__branchBody">{children}</div>
    </div>
  )
}

export function DecisionTree({ question, items }) {
  return (
    <div className="hb-decision">
      <div className="hb-decision__question">{question}</div>
      <div className="hb-decision__list">
        {items.map((item) => (
          <div className="hb-decision__item" key={`${item.label}-${item.value}`}>
            <span className="hb-decision__label">{item.label}</span>
            <span className="hb-decision__connector" aria-hidden="true">→</span>
            <strong className="hb-decision__value">{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LifecycleBar({ items }) {
  return (
    <div className="hb-lifecycle" role="list">
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          <div className={`hb-lifecycle__step hb-lifecycle__step--${item.tone || 'blue'}`} role="listitem">
            <span className="hb-lifecycle__index">{index + 1}</span>
            <span>{item.label}</span>
          </div>
          {index < items.length - 1 && <span className="hb-lifecycle__connector" aria-hidden="true">→</span>}
        </React.Fragment>
      ))}
    </div>
  )
}
