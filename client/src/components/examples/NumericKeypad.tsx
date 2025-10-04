import NumericKeypad from '../NumericKeypad';

export default function NumericKeypadExample() {
  return (
    <div className="p-4">
      <NumericKeypad
        onNumberClick={(num) => console.log('Number clicked:', num)}
        onDelete={() => console.log('Delete clicked')}
      />
    </div>
  );
}
