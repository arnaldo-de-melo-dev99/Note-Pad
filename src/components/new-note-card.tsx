import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
    onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
    const [shouldShowOnboard, setShouldShowOnboard] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
    const [content, setContent] = useState('')

    function handleStartEditor() {
        setShouldShowOnboard(false)
    }

    function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value)
        if (event.target.value == '') {
            setShouldShowOnboard(true)
        }
    }

    function handleSaveNote() {

        if (content == '') {
            return
        }

        onNoteCreated(content)

        setContent('')
        setShouldShowOnboard(true)

        toast.success('Nota criada com sucesso')
    }

    function handleStartRecording() {

        const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
            || 'webkitSpeechRecognition' in window

        if (!isSpeechRecognitionAPIAvailable) {
            alert("Infelizmente o teu navegador nao possui suporte a esta funcionalidade")
            return
        }

        setIsRecording(true)
        setShouldShowOnboard(false)

        const SpeechRecognitionAPIA = window.SpeechRecognition || window.webkitSpeechRecognition

        speechRecognition = new SpeechRecognitionAPIA()

        speechRecognition.lang = 'pt'
        speechRecognition.continuous = true
        speechRecognition.maxAlternatives = 1
        speechRecognition.interimResults = true

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            }, '')

            setContent(transcription)
        }

        speechRecognition.onerror = (event) => {
            console.error(event)
        }

        speechRecognition.start()
    }

    function handleStopRecording() {
        setIsRecording(false)

        if (speechRecognition != null) {
            speechRecognition.stop()
        }
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 p-5 text-left gap-3  hover:ring-2 ring-slate-400 focus-visible:ring-2 focus-visible: ring-lime-400">
                <span className="text-sm font-medium text-slate-200">
                    Adicionar nota
                </span>
                <p className="text-sm leading-6 text-slate-400">
                    Grave uma nota em audio que sera convertida para texto automaticamente
                </p>
            </Dialog.Trigger>

            <Dialog.Portal>

                <Dialog.Overlay className='inset-0 fixed bg-black/60' />

                <Dialog.Content className='fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[70vh] bg-gray-400 first:max-w-[640px]   bg-slate-600 rounded-md flex outline-none'>

                    <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
                        <X className='size-5' />
                    </Dialog.Close>

                    <form onSubmit={handleSaveNote} className='flex-1 flex flex-col'>
                        <div className='flex flex-1 flex-col gap-3 p-5'>
                            <span className="text-sm font-medium text-slate-300">
                                Adicionar nota
                            </span>
                            {shouldShowOnboard ? (
                                <p className="text-sm leading-6 text-slate-400">
                                    comece <button type='button' onClick={handleStartRecording} className='font-medium text-lime-400 hover:underline'>gravando uma nota</button> em áudio ou se preferir <button type='button' onClick={handleStartEditor} className='font-medium text-lime-400 hover:underline'>utilize apenas texto</button>.
                                </p>
                            ) : (
                                <textarea
                                    autoFocus
                                    className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                                    onChange={handleContentChange}
                                    value={content}
                                />
                            )}
                        </div>

                        {isRecording ? (
                            <button
                                type="button"
                                onClick={handleStopRecording}
                                className='w-full bg-slate-900 py-4 text-center text-sm flex items-center justify-center gap-2 text-slate-100 outline-none rounded-b-md font-medium hover:bg-slate-850'
                            >
                                <div className='size-3 rounded-full bg-red-500 animate-pulse' />
                                Gravandom(click p/ interromper)
                            </button>
                        ) : (

                            <button
                                type="button"
                                onClick={handleSaveNote}
                                className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none rounded-b-md font-medium hover:bg-lime-500'
                             >
                                Salvar nota
                            </button>

                        )}
                    </form>

                </Dialog.Content>
            </Dialog.Portal>

        </Dialog.Root>
    )
}