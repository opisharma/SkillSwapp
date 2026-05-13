<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            // Add indexes for query optimization
            $table->index(['match_id', 'created_at'], 'messages_match_created_at_index');
            $table->index(['receiver_id', 'read_at'], 'messages_receiver_read_at_index');
            $table->index(['sender_id'], 'messages_sender_id_index');
            $table->index(['created_at'], 'messages_created_at_index');
        });
    }

    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropIndex('messages_match_created_at_index');
            $table->dropIndex('messages_receiver_read_at_index');
            $table->dropIndex('messages_sender_id_index');
            $table->dropIndex('messages_created_at_index');
        });
    }
};
