import * as React from 'react';

export function Badge({children, variant = "default"}:{children: React.ReactNode; variant?: "default" | "success" | "warning"}){
  const variantClasses = {
    default: "badge",
    success: "badge bg-green-50 text-green-700 border-green-200",
    warning: "badge bg-orange-50 text-orange-700 border-orange-200"
  };
  return <span className={variantClasses[variant]}>{children}</span>; 
}

export function Toggle({label, checked, onChange}:{label:string; checked:boolean; onChange:(v:boolean)=>void}){
  return (
    <label className="toggle cursor-pointer select-none">
      <input type="checkbox" className="sr-only" checked={checked} onChange={e=>onChange(e.target.checked)} />
      <span className={`h-5 w-9 rounded-full transition-colors ${checked?'bg-brand-600':'bg-slate-300'} relative inline-block`}>
        <span className={`block h-4 w-4 transform rounded-full bg-white shadow transition-transform absolute top-0.5 ${checked?'translate-x-4 left-0.5':'left-0.5'}`}/>
      </span>
      <span className="ml-2">{label}</span>
    </label>
  );
}