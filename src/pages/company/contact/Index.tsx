
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/core/card';

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-gradient text-3xl font-heading">Contact Us</CardTitle>
          <CardDescription>
            Get in touch with our team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Contact form coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPage;
