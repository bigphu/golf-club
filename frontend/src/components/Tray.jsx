import React from 'react'

const Tray = ({ 
  pos = '', 
  size = 'col-span-2', 
  dir = 'flex-col', 
  className = '', 
  variant = 'flex', 
  title, 
  children, 
  ...props 
}) => {
  
  // Define layout styles based on the variant
  let contentLayoutStyles = '';

  if (variant === 'grid') {
    contentLayoutStyles = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-items-center w-full gap-4';
  } else if (variant === 'scroll') {
    contentLayoutStyles = 'grid grid-flow-col auto-cols-[23%] w-full overflow-x-scroll gap-6 pb-4'; 
  } else {
    contentLayoutStyles = `flex ${dir} w-full`;
  }

  return (
    <div 
      className={`${pos} ${size} flex flex-col ${className}`} 
      {...props}
    >
      {/* FIX: Removed 'overflow-hidden'. 
        Added 'relative' to maintain layout context without clipping children.
      */}
      <div className="flex flex-col items-start justify-start bg-surface py-6 px-8 gap-4 shadow-sm shadow-secondary-accent rounded-3xl h-full relative">
        
        {/* Render Title if provided */}
        {title && (
          <div className="w-full shrink-0">
            {title}
          </div>
        )}

        {/* Render Content */}
        <div className={`${contentLayoutStyles} scrollbar-thin`}>
          {children}
        </div>

      </div>
    </div>
  )
}

export default Tray