import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head>
        <title>Verification Email</title>
      </Head>
      <Preview>Here&apos;s Your Verification code : {otp}</Preview>
      <Section>
        <Row>
          <Heading>Hello {username}</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registeration , Please use the below mention code to
            complete your verification
          </Text>
        </Row>
        <Row>
          <Text>{otp}</Text>
        </Row>
        <Row>
          <Text>
            If you did not request this code , kindly ignore this email
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
