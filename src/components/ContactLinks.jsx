// src/components/ContactLinks.jsx

const contactData = [
  {
    id: 1,
    label: "0917 169 5791",
    href: "tel:0917 169 5791",
    icon: "https://cdn-icons-png.flaticon.com/512/15/15874.png",
  },
  {
    id: 2,
    label: "villaroseseabreezeresort@gmail.com",
    href: "mailto:villaroseseabreezeresort@gmail.com",
    icon: "https://cdn-icons-png.flaticon.com/512/561/561127.png",
  },
  {
    id: 3,
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61583957159834",
    icon: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
  },
  {
    id: 4,
    label: "Instagram",
    href: "#",
    icon: "https://cdn-icons-png.flaticon.com/512/174/174855.png",
  },
];

export default function ContactLinks() {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center items-center">
      {contactData.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 text-cyan-400 font-semibold transition-all hover:text-teal-600 hover:-translate-y-0.5"
        >
          <img
            src={item.icon}
            alt={item.label}
            className="w-5 h-5 opacity-80 group-hover:opacity-100"
          />
          <span>{item.label}</span>
        </a>
      ))}
    </div>
  );
}
