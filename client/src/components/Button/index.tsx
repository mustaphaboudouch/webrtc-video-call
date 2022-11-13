interface ButtonProps {
	children: string;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({ children, onClick }: ButtonProps) => {
	return (
		<button
			className='bg-indigo-600 px-5 py-3 text-sm text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default Button;
