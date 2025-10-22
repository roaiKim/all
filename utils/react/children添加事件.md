```ts
import React, { 
  ReactNode, 
  ReactElement, 
  MouseEvent, 
  PropsWithChildren 
} from 'react';

type WithClickHandler<T = {}> = T & {
  onClick?: (event: MouseEvent) => void;
};

function withClickHandler<T extends {}>(
  WrappedComponent: React.ComponentType<T>,
  onClick: (event: MouseEvent) => void
) {
  return (props: WithClickHandler<T>) => {
    const handleClick = (event: MouseEvent) => {
      if (props.onClick) {
        props.onClick(event);
      }
      onClick(event);
    };

    return <WrappedComponent {...props} onClick={handleClick} />;
  };
}

interface ClickableParentProps {
  onClick: (event: MouseEvent) => void;
  className?: string;
}

function ClickableParent({
  children,
  onClick,
  className = ''
}: PropsWithChildren<ClickableParentProps>) {
  return (
    <div className={`clickable-parent ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const EnhancedChild = withClickHandler(child.type, onClick);
          return <EnhancedChild {...child.props} />;
        }
        return child;
      })}
    </div>
  );
}
```