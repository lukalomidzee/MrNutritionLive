import ProfilePageClient from "../ProfilePageClient";

export function generateStaticParams() {
    return [{ name: "demo-user" }];
}

export default function ProfilePage() {
    return <ProfilePageClient />;
}
