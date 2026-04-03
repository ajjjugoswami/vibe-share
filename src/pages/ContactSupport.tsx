import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Mail, User, Phone, MessageSquare, CheckCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const LEAD_API = "https://cs.fabbuilder.com/api/tenant/6968ad6910bd851d326bc8a3/lead";

const ContactSupport = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    email: "",
    phone: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.firstName.trim() || !form.email.trim() || !form.description.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        companyName: "SoundBoard App",
        firstName: form.firstName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        description: `${form.firstName.trim()}-${form.description.trim()}`,
        source: "website",
      });

      const res = await fetch(`${LEAD_API}?${params.toString()}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Message Sent!</h2>
        <p className="text-muted-foreground text-sm">
          Thanks for reaching out. We'll get back to you soon.
        </p>
        <Button onClick={() => navigate("/settings")} variant="outline" className="mt-4 rounded-xl">
          Back to Settings
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/settings")} className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Contact Support</h1>
      </div>

      {/* Info */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
        <p className="text-sm text-muted-foreground">
          Have an issue or suggestion? Fill out the form below and our team will get back to you as soon as possible.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-foreground flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-primary" /> Name <span className="text-red-400">*</span>
          </Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="Your name"
            value={form.firstName}
            onChange={handleChange}
            className="rounded-xl bg-secondary/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-primary" /> Email <span className="text-red-400">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
            className="rounded-xl bg-secondary/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-primary" /> Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91 XXXXXXXXXX"
            value={form.phone}
            onChange={handleChange}
            className="rounded-xl bg-secondary/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-primary" /> Message <span className="text-red-400">*</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe your issue or suggestion..."
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="rounded-xl bg-secondary/50 border-border resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl h-12 text-base font-semibold gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
};

export default ContactSupport;
