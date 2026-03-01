import { useState, useEffect } from "react";
import { Plus, BookOpen, Trash2, Edit, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import * as api from "../../lib/api";

interface TeacherQuizManagementProps {
    currentUser: any;
    selectedClass: string;
}

interface Question {
    text: string;
    options: string[];
    correctAnswerIndex: number;
}

const emptyQuestion = (): Question => ({
    text: "",
    options: ["", "", "", ""],
    correctAnswerIndex: 0,
});

const emptyForm = () => ({
    title: "",
    description: "",
    topic: "",
    difficulty: "EASY",
    questions: [emptyQuestion()],
});

export function TeacherQuizManagement({ currentUser, selectedClass }: TeacherQuizManagementProps) {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm());
    const [isSaving, setIsSaving] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        api.getTeacherQuizzes()
            .then(setQuizzes)
            .catch(() => setQuizzes([]))
            .finally(() => setLoading(false));
    }, []);

    const startCreate = () => {
        setForm(emptyForm());
        setEditingQuizId(null);
        setShowForm(true);
    };

    const startEdit = (quiz: any) => {
        setForm({
            title: quiz.title ?? "",
            description: quiz.description ?? "",
            topic: quiz.topic ?? "",
            difficulty: quiz.difficulty ?? "EASY",
            questions: quiz.questions?.length
                ? quiz.questions.map((q: any) => ({
                    text: q.text ?? q.questionText ?? "",
                    options: q.options ?? ["", "", "", ""],
                    correctAnswerIndex: q.correctAnswerIndex ?? 0,
                }))
                : [emptyQuestion()],
        });
        setEditingQuizId(String(quiz.id));
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!form.title.trim()) { alert("Title is required"); return; }
        setIsSaving(true);
        try {
            const payload = {
                title: form.title,
                description: form.description,
                topic: form.topic,
                difficulty: form.difficulty,
                isPublished: false,
                questions: form.questions
                    .filter(q => q.text.trim())
                    .map(q => ({
                        questionText: q.text,
                        options: q.options,
                        correctAnswerIndex: q.correctAnswerIndex,
                    })),
            };

            if (editingQuizId) {
                const updated = await api.updateQuiz(editingQuizId, payload);
                setQuizzes(prev => prev.map(q => q.id === updated.id ? { ...q, ...updated } : q));
            } else {
                const created = await api.createQuiz(payload);
                setQuizzes(prev => [created, ...prev]);
            }
            setShowForm(false);
            setEditingQuizId(null);
            setForm(emptyForm());
        } catch (err: any) {
            alert(`Failed to save quiz: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this quiz?")) return;
        try {
            await api.deleteQuiz(id);
            setQuizzes(prev => prev.filter(q => String(q.id) !== id));
        } catch (err: any) {
            alert(`Failed to delete: ${err.message}`);
        }
    };

    const handlePublish = async (quiz: any) => {
        try {
            await api.publishQuiz(String(quiz.id));
            setQuizzes(prev => prev.map(q => q.id === quiz.id ? { ...q, isPublished: true } : q));
        } catch (err: any) {
            alert(`Failed to publish: ${err.message}`);
        }
    };

    const addQuestion = () => setForm(f => ({ ...f, questions: [...f.questions, emptyQuestion()] }));
    const removeQuestion = (i: number) => setForm(f => ({ ...f, questions: f.questions.filter((_, idx) => idx !== i) }));

    const updateQuestion = (i: number, field: keyof Question, value: any) => {
        setForm(f => {
            const qs = [...f.questions];
            qs[i] = { ...qs[i], [field]: value };
            return { ...f, questions: qs };
        });
    };

    const updateOption = (qi: number, oi: number, value: string) => {
        setForm(f => {
            const qs = [...f.questions];
            const opts = [...qs[qi].options];
            opts[oi] = value;
            qs[qi] = { ...qs[qi], options: opts };
            return { ...f, questions: qs };
        });
    };

    return (
        <div className="p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Quiz Management</h2>
                    <p className="text-sm text-gray-600">Create and manage quizzes for your students</p>
                </div>
                <Button onClick={startCreate} className="bg-[#2ECC71] hover:bg-[#27AE60] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Quiz
                </Button>
            </div>

            {/* Quiz List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-8 text-gray-400">Loading quizzes...</div>
                ) : quizzes.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <p className="text-4xl mb-2">📝</p>
                        <p>No quizzes yet. Create your first quiz!</p>
                    </div>
                ) : quizzes.map((quiz) => (
                    <Card key={quiz.id} className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                                    <p className="text-sm text-gray-500">
                                        {quiz.questionCount ?? quiz.questions?.length ?? 0} questions · {quiz.difficulty} · {quiz.totalAttempts ?? 0} attempts
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${quiz.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                    {quiz.isPublished ? "Published" : "Draft"}
                                </span>
                                <button
                                    onClick={() => setExpandedId(expandedId === String(quiz.id) ? null : String(quiz.id))}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    {expandedId === String(quiz.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {expandedId === String(quiz.id) && (
                            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center space-x-2">
                                <Button size="sm" variant="outline" onClick={() => startEdit(quiz)}>
                                    <Edit className="w-4 h-4 mr-1" /> Edit
                                </Button>
                                {!quiz.isPublished && (
                                    <Button size="sm" variant="outline" onClick={() => handlePublish(quiz)}>
                                        Publish
                                    </Button>
                                )}
                                <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDelete(String(quiz.id))}>
                                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                                </Button>
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            {/* Create / Edit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">{editingQuizId ? "Edit Quiz" : "Create Quiz"}</h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                        placeholder="Quiz title"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={form.description}
                                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                        rows={2}
                                        placeholder="Brief description"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                                    <input
                                        type="text"
                                        value={form.topic}
                                        onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                                        placeholder="e.g., Climate Change"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                                    <select
                                        value={form.difficulty}
                                        onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                                    >
                                        <option value="EASY">Easy</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HARD">Hard</option>
                                    </select>
                                </div>
                            </div>

                            {/* Questions */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">Questions</label>
                                    <Button size="sm" variant="outline" onClick={addQuestion}>
                                        <Plus className="w-3 h-3 mr-1" /> Add Question
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {form.questions.map((q, qi) => (
                                        <div key={qi} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700">Question {qi + 1}</span>
                                                {form.questions.length > 1 && (
                                                    <button onClick={() => removeQuestion(qi)} className="text-red-400 hover:text-red-600">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                value={q.text}
                                                onChange={e => updateQuestion(qi, "text", e.target.value)}
                                                placeholder="Question text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                                            />
                                            <div className="space-y-2">
                                                {q.options.map((opt, oi) => (
                                                    <div key={oi} className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name={`correct-${qi}`}
                                                            checked={q.correctAnswerIndex === oi}
                                                            onChange={() => updateQuestion(qi, "correctAnswerIndex", oi)}
                                                            className="text-[#2ECC71]"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={opt}
                                                            onChange={e => updateOption(qi, oi, e.target.value)}
                                                            placeholder={`Option ${oi + 1}`}
                                                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                                                        />
                                                    </div>
                                                ))}
                                                <p className="text-xs text-gray-400">Select the radio button next to the correct answer.</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-3 pt-2">
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-1 bg-[#2ECC71] hover:bg-[#27AE60] text-white disabled:opacity-50"
                                >
                                    {isSaving ? "Saving..." : editingQuizId ? "Save Changes" : "Create Quiz"}
                                </Button>
                                <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
