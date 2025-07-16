import './Button.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
}

export default function Button( {variant = 'primary', size = 'medium', children, ...props }: ButtonProps ){
    return (
        <button
            className={`btn-${variant} btn-${size}`}
            {...props}
        >
            {children}
        </button>
    );
}