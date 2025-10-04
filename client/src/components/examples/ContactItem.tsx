import ContactItem from '../ContactItem';

export default function ContactItemExample() {
  return (
    <div className="p-4 max-w-md">
      <ContactItem
        id="1"
        name="Ali Ahmed"
        phone="+1-300-555-0161"
        avatarColor="bg-orange-500"
        onClick={() => console.log('Contact clicked')}
      />
    </div>
  );
}
