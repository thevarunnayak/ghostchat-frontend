export default function ChatLayout({ sidebar, header, messages, input, modal }: any) {
  return (
    <>
      <div className="h-screen flex bg-black text-(--text)">
        {sidebar}

        <div className="flex-1 flex flex-col">
          {header}
          {messages}
          {input}
        </div>
      </div>

      {modal}
    </>
  );
}