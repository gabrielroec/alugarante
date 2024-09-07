import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { useKanban } from "@/contexts/KanbanContext";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { DialogHeader, DialogFooter } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import arrowBg from "../assets/arrow-bg.svg";

const KanbanCard = ({ card, fromBoardId, pipelineName }: any) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: { id: card.id, fromBoardId, pipelineName },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  const { updateCard } = useKanban();
  const [isEditing, setIsEditing] = useState(false);
  const [isView, setIsView] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDetails, setEditDetails] = useState(card.details);
  const { selectedPipeline } = useKanban();
  const { pipelines } = useKanban();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { deleteCard } = useKanban();

  const handleSave = () => {
    updateCard(pipelineName, fromBoardId, { ...card, title: editTitle, details: editDetails });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteCard(pipelineName, fromBoardId, card.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <motion.div
      ref={drag as unknown as React.RefObject<HTMLDivElement>}
      initial={{ scale: 0 }}
      animate={isDragging ? { scale: 0 } : { scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className={`p-4 bg-white rounded-lg mb-2 ${isDragging ? "opacity-50" : ""}`}
    >
      <h3 className="font-semibold">{card.title}</h3>
      <p className="text-gray-600">{card.details}</p>
      <div className="flex items-center justify-end gap-2">
        <Dialog open={isView} onOpenChange={setIsView}>
          <DialogTrigger asChild>
            <Button className="bg-white p-0 m-0 w-fit h-fit hover:bg-white">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.111328 6.39999C0.111328 4.15979 0.111328 3.03969 0.547302 2.18404C0.930796 1.43139 1.54272 0.819467 2.29537 0.435974C3.15101 0 4.27112 0 6.51133 0H18.6002C20.8404 0 21.9605 0 22.8162 0.435974C23.5688 0.819467 24.1807 1.43139 24.5642 2.18404C25.0002 3.03969 25.0002 4.15979 25.0002 6.4V18.4889C25.0002 20.7291 25.0002 21.8492 24.5642 22.7049C24.1807 23.4575 23.5688 24.0694 22.8162 24.4529C21.9605 24.8889 20.8404 24.8889 18.6002 24.8889H6.51132C4.27112 24.8889 3.15101 24.8889 2.29537 24.4529C1.54272 24.0694 0.930796 23.4575 0.547302 22.7049C0.111328 21.8492 0.111328 20.7291 0.111328 18.4889V6.39999Z"
                  fill="#F5F5F5"
                />
                <path
                  d="M18.7779 6.78788V9.61616C18.7779 9.92727 18.5234 10.1818 18.2123 10.1818C17.9012 10.1818 17.6466 9.92727 17.6466 9.61616V8.1596L14.3658 11.4404C14.2527 11.5535 14.1113 11.6101 13.9699 11.6101C13.8284 11.6101 13.687 11.5535 13.5739 11.4404C13.3476 11.2141 13.3476 10.8606 13.5739 10.6343L16.8406 7.35353H15.384C15.0729 7.35353 14.8183 7.09899 14.8183 6.78788C14.8183 6.47677 15.0729 6.22222 15.384 6.22222H18.2123C18.3678 6.22222 18.5093 6.27879 18.6082 6.39192C18.7214 6.49091 18.7779 6.63232 18.7779 6.78788ZM18.2123 14.7071C17.9012 14.7071 17.6466 14.9616 17.6466 15.2727V16.7293L14.4224 13.5333C14.1961 13.3071 13.8284 13.3071 13.6022 13.5333C13.3759 13.7596 13.3759 14.1131 13.588 14.3394L16.784 17.5354H15.3274C15.0163 17.5354 14.7618 17.7899 14.7618 18.101C14.7618 18.4121 15.0163 18.6667 15.3274 18.6667H18.1557C18.3113 18.6667 18.481 18.6101 18.58 18.497C18.6931 18.3838 18.7779 18.2424 18.7779 18.101V15.2727C18.7779 14.9616 18.5234 14.7071 18.2123 14.7071ZM10.6891 13.5051L7.46481 16.7293V15.2727C7.46481 14.9616 7.21026 14.7071 6.89915 14.7071C6.58804 14.7071 6.3335 14.9616 6.3335 15.2727V18.101C6.3335 18.2566 6.39006 18.398 6.50319 18.497C6.61632 18.6101 6.75774 18.6667 6.91329 18.6667H9.74158C10.0527 18.6667 10.3072 18.4121 10.3072 18.101C10.3072 17.7899 10.0527 17.5354 9.74158 17.5354H8.27087L11.4951 14.3111C11.7214 14.0848 11.7072 13.7313 11.4951 13.5051C11.283 13.2788 10.9153 13.2788 10.6891 13.5051ZM8.27087 7.4101H9.72744C10.0385 7.4101 10.2931 7.15555 10.2931 6.84444C10.2931 6.53333 10.0385 6.27879 9.72744 6.27879H6.89915C6.7436 6.27879 6.60218 6.33535 6.50319 6.44848C6.39006 6.54747 6.3335 6.68889 6.3335 6.84444V9.67273C6.3335 9.98384 6.58804 10.2384 6.89915 10.2384C7.21026 10.2384 7.46481 9.98384 7.46481 9.67273V8.20202L10.7315 11.4687C10.8446 11.5818 10.986 11.6384 11.1274 11.6384C11.2689 11.6384 11.4103 11.5818 11.5234 11.4687C11.7497 11.2424 11.7497 10.8889 11.5234 10.6626L8.27087 7.4101Z"
                  fill="#D9D9D9"
                />
              </svg>
            </Button>
          </DialogTrigger>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>{card.title}</DialogTitle>
              <div className="flex items-center gap-4 !mt-[20px]">
                <div className="flex">Pipeline: {selectedPipeline}</div>
                <div className="flex">Situação: {card.status}</div>
              </div>
              <ul className="flex items-center gap-0">
                {pipelines[selectedPipeline]?.map((board, index) => {
                  const currentBoardIndex = pipelines[selectedPipeline]?.findIndex((b) => b.cards.some((c) => c.id === card.id));
                  const isActiveOrPrevious = index <= currentBoardIndex;

                  return (
                    <li
                      key={board.id}
                      className={`relative w-full max-w-[150px] h-[36px] p-4 text-white flex items-center my-[20px] ${
                        isActiveOrPrevious ? "bg-[url('../assets/arrow-bg.svg')] bg-contain bg-no-repeat bg-center" : "text-[#1d1d1d]"
                      }`}
                    >
                      {board.name}
                    </li>
                  );
                })}
              </ul>
            </DialogHeader>

            <DialogFooter>
              <Button className="bg-[#87A644] w-full" onClick={handleSave}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button className="bg-white p-0 m-0 w-fit h-fit hover:bg-white">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.000244141 6.39999C0.000244141 4.15979 0.000244141 3.03969 0.436218 2.18404C0.819712 1.43139 1.43163 0.819467 2.18428 0.435974C3.03993 0 4.16003 0 6.40024 0H18.4891C20.7293 0 21.8494 0 22.7051 0.435974C23.4577 0.819467 24.0697 1.43139 24.4532 2.18404C24.8891 3.03969 24.8891 4.15979 24.8891 6.4V18.4889C24.8891 20.7291 24.8891 21.8492 24.4532 22.7049C24.0697 23.4575 23.4577 24.0694 22.7051 24.4529C21.8494 24.8889 20.7293 24.8889 18.4891 24.8889H6.40024C4.16003 24.8889 3.03993 24.8889 2.18428 24.4529C1.43163 24.0694 0.819712 23.4575 0.436218 22.7049C0.000244141 21.8492 0.000244141 20.7291 0.000244141 18.4889V6.39999Z"
                  fill="#F5F5F5"
                />
                <path
                  d="M11.1697 11.2237L10.4219 13.7174C10.3584 13.9294 10.4164 14.1596 10.573 14.316C10.6875 14.4304 10.8414 14.4924 10.9988 14.4924C11.0566 14.4924 11.1148 14.4842 11.1717 14.4669L13.6655 13.7193C13.761 13.6907 13.848 13.6389 13.9184 13.5684L18.4906 8.9962C18.6035 8.8833 18.667 8.73001 18.667 8.57046C18.667 8.41091 18.6035 8.25762 18.4906 8.14472L16.7443 6.39864C16.5091 6.16343 16.128 6.16343 15.8928 6.39864L11.3208 10.9708C11.2503 11.0414 11.1985 11.128 11.1697 11.2237ZM12.2797 11.7149L16.3186 7.67586L17.2132 8.57046L13.1743 12.6095L11.8967 12.9925L12.2797 11.7149Z"
                  fill="#D9D9D9"
                />
                <path
                  d="M18.0647 11.8424C17.7321 11.8424 17.4626 12.1121 17.4626 12.4445V16.4589C17.4626 17.0124 17.0123 17.4625 16.459 17.4625H8.4303C7.87695 17.4625 7.42671 17.0124 7.42671 16.4589V8.4302C7.42671 7.87666 7.87695 7.42661 8.4303 7.42661H12.4446C12.7773 7.42661 13.0468 7.1569 13.0468 6.82446C13.0468 6.49203 12.7773 6.22231 12.4446 6.22231H8.4303C7.21287 6.22231 6.22241 7.21296 6.22241 8.4302V16.4589C6.22241 17.6761 7.21287 18.6668 8.4303 18.6668H16.459C17.6764 18.6668 18.6669 17.6761 18.6669 16.4589V12.4445C18.6669 12.1121 18.3973 11.8424 18.0647 11.8424Z"
                  fill="#D9D9D9"
                />
              </svg>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar nome da etapa</DialogTitle>
            </DialogHeader>
            <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="New Board Name" />
            <Textarea value={editDetails} onChange={(e) => setEditDetails(e.target.value)} placeholder="Editar descrição" />
            <DialogFooter>
              <Button className="bg-[#87A644] w-full" onClick={handleSave}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="p-0 m-0 w-fit h-fit bg-white hover:bg-white">
              <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.88916 6.39999C0.88916 4.15979 0.88916 3.03969 1.32513 2.18404C1.70863 1.43139 2.32055 0.819467 3.0732 0.435974C3.92885 0 5.04895 0 7.28916 0H19.3781C21.6183 0 22.7384 0 23.594 0.435974C24.3467 0.819467 24.9586 1.43139 25.3421 2.18404C25.778 3.03969 25.778 4.15979 25.778 6.4V18.4889C25.778 20.7291 25.778 21.8492 25.3421 22.7049C24.9586 23.4575 24.3467 24.0694 23.594 24.4529C22.7384 24.8889 21.6183 24.8889 19.378 24.8889H7.28915C5.04895 24.8889 3.92885 24.8889 3.0732 24.4529C2.32055 24.0694 1.70863 23.4575 1.32513 22.7049C0.88916 21.8492 0.88916 20.7291 0.88916 18.4889V6.39999Z"
                  fill="#FFC2C2"
                />
                <path
                  d="M17.5631 10.2864L17.3698 16.1363C17.3533 16.6373 17.1423 17.1122 16.7814 17.4602C16.4206 17.8081 15.9383 18.0018 15.437 18H11.7648C11.2638 18.0018 10.7819 17.8084 10.4211 17.4609C10.0603 17.1133 9.84901 16.6389 9.83205 16.1383L9.63877 10.2864C9.63455 10.1582 9.6814 10.0336 9.76902 9.94003C9.85665 9.84643 9.97787 9.79146 10.106 9.78724C10.2342 9.78301 10.3587 9.82986 10.4524 9.91748C10.546 10.0051 10.6009 10.1263 10.6052 10.2545L10.7984 16.1059C10.8081 16.3557 10.9141 16.592 11.0943 16.7653C11.2745 16.9386 11.5148 17.0352 11.7648 17.0351H15.437C15.6873 17.0352 15.9279 16.9383 16.1082 16.7646C16.2884 16.5909 16.3943 16.3541 16.4034 16.104L16.5967 10.2545C16.6009 10.1263 16.6559 10.0051 16.7495 9.91748C16.8431 9.82986 16.9677 9.78301 17.0958 9.78724C17.224 9.79146 17.3452 9.84643 17.4328 9.94003C17.5204 10.0336 17.5673 10.1582 17.5631 10.2864ZM18.2023 8.3396C18.2023 8.46775 18.1514 8.59065 18.0608 8.68127C17.9702 8.77188 17.8473 8.82279 17.7191 8.82279H9.48319C9.35504 8.82279 9.23214 8.77188 9.14152 8.68127C9.05091 8.59065 9 8.46775 9 8.3396C9 8.21145 9.05091 8.08855 9.14152 7.99794C9.23214 7.90732 9.35504 7.85641 9.48319 7.85641H10.9811C11.1342 7.85683 11.2819 7.80026 11.3956 7.69773C11.5093 7.5952 11.5808 7.45404 11.5962 7.30171C11.6318 6.94439 11.7992 6.61314 12.0658 6.3725C12.3323 6.13186 12.6789 5.99907 13.038 6H14.1638C14.5229 5.99907 14.8695 6.13186 15.1361 6.3725C15.4026 6.61314 15.57 6.94439 15.6057 7.30171C15.621 7.45404 15.6925 7.5952 15.8062 7.69773C15.9199 7.80026 16.0677 7.85683 16.2208 7.85641H17.7186C17.8468 7.85641 17.9697 7.90732 18.0603 7.99794C18.1509 8.08855 18.2023 8.21145 18.2023 8.3396ZM12.435 7.85641H14.7678C14.7043 7.71133 14.6628 7.5576 14.6446 7.40028C14.6326 7.28118 14.5769 7.17076 14.4881 7.09042C14.3994 7.01008 14.284 6.96553 14.1643 6.96542H13.0385C12.9188 6.96553 12.8034 7.01008 12.7147 7.09042C12.6259 7.17076 12.5702 7.28118 12.5582 7.40028C12.5399 7.55763 12.4986 7.71136 12.435 7.85641ZM12.9216 15.1772V11.0629C12.9216 10.9347 12.8706 10.8118 12.78 10.7212C12.6894 10.6306 12.5665 10.5797 12.4384 10.5797C12.3102 10.5797 12.1873 10.6306 12.0967 10.7212C12.0061 10.8118 11.9552 10.9347 11.9552 11.0629V15.1791C11.9552 15.3073 12.0061 15.4302 12.0967 15.5208C12.1873 15.6114 12.3102 15.6623 12.4384 15.6623C12.5665 15.6623 12.6894 15.6114 12.78 15.5208C12.8706 15.4302 12.9216 15.3073 12.9216 15.1791V15.1772ZM15.2476 15.1772V11.0629C15.2476 10.9347 15.1967 10.8118 15.1061 10.7212C15.0155 10.6306 14.8926 10.5797 14.7644 10.5797C14.6363 10.5797 14.5134 10.6306 14.4228 10.7212C14.3322 10.8118 14.2812 10.9347 14.2812 11.0629V15.1791C14.2812 15.3073 14.3322 15.4302 14.4228 15.5208C14.5134 15.6114 14.6363 15.6623 14.7644 15.6623C14.8926 15.6623 15.0155 15.6114 15.1061 15.5208C15.1967 15.4302 15.2476 15.3073 15.2476 15.1791V15.1772Z"
                  fill="#B85151"
                />
              </svg>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
            </DialogHeader>
            <p>Tem certeza que deseja excluir este card? Esta ação não pode ser desfeita.</p>
            <DialogFooter>
              <Button className="bg-red-500 w-full" onClick={handleDelete}>
                Excluir
              </Button>
              <Button className="bg-gray-300 w-full" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
};

export default KanbanCard;
