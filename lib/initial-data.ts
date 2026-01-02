import type { Folder, Template } from "./types"

export const initialFolders: Folder[] = [
  { id: "1", name: "Приветствия", parentId: null, createdAt: new Date() },
  { id: "2", name: "Технические вопросы", parentId: null, createdAt: new Date() },
  { id: "3", name: "Оплата и доставка", parentId: null, createdAt: new Date() },
  { id: "4", name: "Возврат товара", parentId: "3", createdAt: new Date() },
  { id: "5", name: "Способы оплаты", parentId: "3", createdAt: new Date() },
]

export const initialTemplates: Template[] = [
  {
    id: "t1",
    name: "Стандартное приветствие",
    content: "Здравствуйте! Меня зовут [Имя], чем могу вам помочь?",
    folderId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "t2",
    name: "Приветствие VIP клиента",
    content: "Добрый день! Рады приветствовать вас как нашего постоянного клиента. Чем могу помочь?",
    folderId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "t3",
    name: "Сброс пароля",
    content: "Для сброса пароля перейдите по ссылке: [ссылка]. Если возникнут вопросы — напишите!",
    folderId: "2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "t4",
    name: "Возврат в течение 14 дней",
    content:
      "Вы можете вернуть товар в течение 14 дней с момента получения. Для оформления возврата напишите номер заказа.",
    folderId: "4",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "t5",
    name: "Способы оплаты",
    content: "Мы принимаем оплату картами Visa, MasterCard, Мир, а также через СБП и электронные кошельки.",
    folderId: "5",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
