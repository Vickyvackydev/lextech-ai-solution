import { Message } from "ai";
import { notFound } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { Chat as PreviewChat } from "@/components/custom/chat";
import { getChatById } from "@/lib/actions/chat";
import { Chat as PrismaChat, Message as PrismaMessage } from "@prisma/client";
import { convertToUIMessages } from "@/lib/utils";
import DashboardLayout from "@/shared/Layouts/DashboardLayout";

type ChatWithMessages = PrismaChat & {
  messages: PrismaMessage[];
};

export default async function Page({ params }: { params: { chatId: string } }) {
  const { chatId } = params;

  const session = await auth();
  if (!session?.user) {
    return notFound();
  }

  const chatFromDb = await getChatById(chatId);
  if (!chatFromDb || !chatFromDb.messages) {
    return notFound();
  }

  if (chatFromDb.userId !== session.user.id) {
    return notFound();
  }

  // Convert PrismaMessage[] to Message[] for the UI
  const messages = convertToUIMessages(chatFromDb.messages);

  return (
    <DashboardLayout>
      <PreviewChat
        id={chatFromDb.id}
        initialMessages={messages}
        selectedModelName={"gpt-4o-mini"}
        currentChatId={chatFromDb.id}
        isNewChat={false}
      />
    </DashboardLayout>
  );
}
